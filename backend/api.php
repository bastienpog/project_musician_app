<?php
// Load database connection and dependencies
require_once "db.php";
require_once "vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Set necessary headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// JWT configuration
$SECRET_KEY = "123456789";
$ALGORITHM = "HS256";

// Capture request method and path info
$method = $_SERVER["REQUEST_METHOD"];
$path = explode("/", trim($_SERVER["REQUEST_URI"], "/"));
$input = json_decode(file_get_contents("php://input"), true);

// ROUTING SECTION
if ($path[0] === "auth") {
    switch ($path[1]) {
        case "register":
            // Handle user registration
            if ($method === "POST") {
                registerUser($pdo, $input);
            } else {
                echo json_encode(["error" => "Invalid request method or endpoint"]);
            }
            break;

        case "login":
            // Handle user login
            if ($method === "POST") {
                loginUser($pdo, $input);
            } else {
                echo json_encode(["error" => "Invalid request method or endpoint"]);
            }
            break;

        default:
            echo json_encode(["error" => "Invalid request method or endpoint"]);
    }
} elseif ($path[0] === "users") {
    // Endpoints for user management
    switch ($method) {
        case "GET":
            getAllUsers($pdo); // Get all users
            break;
        case "POST":
            modifyUser($pdo, $input); // Update user details
            break;
        default:
            echo json_encode(["error" => "Invalid request"]);
    }
} elseif ($path[0] === "conversations") {
    // Get user conversations by user ID
    switch ($method) {
        case "POST": 
            $input = json_decode(file_get_contents("php://input"), true);
            if (!isset($input['userId'])) {
                echo json_encode(["error" => "User ID is required"]);
                exit;
            }
            getUserConversations($pdo, $input['userId']);
            break;

        default:
            echo json_encode(["error" => "Invalid request method"]);
    }
} elseif ($path[0] === "messages" && isset($path[1])) {
    // Get all messages for a given conversation ID
    $conversationId = $path[1];
    switch ($method) {
        case "GET":
            getMessagesByConversation($pdo, $conversationId);
            break;
        default:
            echo json_encode(["error" => "Invalid request"]);
    }
} else {
    echo json_encode(["error" => "Invalid endpoint"]);
}


// Retrieve all users from the database
function getAllUsers($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT id, username, email, info, gender, media FROM user");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($users as &$user) {
            $user["media"] = json_decode($user["media"]);
        }

        echo json_encode($users);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Update user profile information
function modifyUser($pdo, $data) {
    if (!isset($data["id"], $data["info"], $data["gender"], $data["media"])) {
        echo json_encode(["error" => "Missing required fields"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE user SET info = :info, gender = :gender, media = :media WHERE id = :id");

        $stmt->execute([
            ":id" => $data["id"], 
            ":info" => $data["info"],
            ":gender" => $data["gender"],
            ":media" => json_encode($data["media"])
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["error" => "User not found or no changes made"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Get all conversations that involve a specific user
function getUserConversations($pdo, $userId) {
    try {
        $stmt = $pdo->prepare("
            SELECT c.ConversationId, c.SenderId, c.RecipientId, 
                   u1.username AS sender_username, 
                   u2.username AS recipient_username
            FROM conversation c
            JOIN user u1 ON u1.id = c.SenderId
            JOIN user u2 ON u2.id = c.RecipientId
            WHERE c.SenderId = :userId OR c.RecipientId = :userId
        ");
        $stmt->execute([":userId" => $userId]);
        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($conversations);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Get messages from a conversation
function getMessagesByConversation($pdo, $conversationId) {
    try {
        $stmt = $pdo->prepare("SELECT m.MessageId, m.SenderId, m.RecipientId, m.content, m.timestamp, 
                                      u1.username AS sender_username, 
                                      u2.username AS recipient_username
                               FROM message m
                               JOIN user u1 ON u1.id = m.SenderId
                               JOIN user u2 ON u2.id = m.RecipientId
                               WHERE m.ConversationId = :conversationId
                               ORDER BY m.timestamp");
        $stmt->execute([":conversationId" => $conversationId]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($messages)) {
            echo json_encode(["error" => "No messages found for this conversation"]);
        } else {
            echo json_encode($messages);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Register a new user with hashed password
function registerUser($pdo, $data) {
    if (!isset($data["username"], $data["email"], $data["password"])) {
        echo json_encode(["error" => "Missing required fields"]);
        return;
    }

    $username = $data["username"];
    $email = $data["email"];
    $password = password_hash($data["password"], PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO user (username, email, password) VALUES (:username, :email, :password)");
        $stmt->execute([
            ":username" => $username,
            ":email" => $email,
            ":password" => $password
        ]);
        echo json_encode(["message" => "User registered successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Log in a user and return JWT token on success
function loginUser($pdo, $data) {
    global $SECRET_KEY, $ALGORITHM;

    if (!isset($data["email"], $data["password"])) {
        echo json_encode(["error" => "Missing email or password"]);
        return;
    }

    $email = $data["email"];
    $password = $data["password"];

    try {
        $stmt = $pdo->prepare("SELECT id, username, password FROM user WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user["password"])) {
            $payload = [
                "id" => $user["id"],
                "username" => $user["username"],
                "exp" => time() + 3600 
            ];
            $token = JWT::encode($payload, $SECRET_KEY, $ALGORITHM);
            echo json_encode([
                "token" => $token,
                "userId" => $user["id"],
                "username" => $user["username"]
            ]);
        } else {
            echo json_encode(["error" => "Invalid credentials"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// JWT verification function
function verifyToken() {
    global $SECRET_KEY, $ALGORITHM;
    try {
        $decoded = JWT::decode($token, new Key($SECRET_KEY, $ALGORITHM));
        return $decoded;
    } catch (Exception $e) {
        echo json_encode(["error" => "Invalid token"]);
        exit;
    }
}
?>
