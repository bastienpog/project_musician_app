<?php
require_once "db.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];
$path = explode("/", trim($_SERVER["REQUEST_URI"], "/"));
$input = json_decode(file_get_contents("php://input"), true);

// Route: /users
if ($path[0] === "users") {
    switch ($method) {
        case "GET":
            getAllUsers($pdo);  // Fetch all users
            break;
        case "POST":
            addUser($pdo, $input);  // Add new user
            break;
        default:
            echo json_encode(["error" => "Invalid request"]);
    }
}
// Route: /conversations
elseif ($path[0] === "conversations") {
    switch ($method) {
        case "GET":
            getAllConversations($pdo);  // Fetch all conversations
            break;
        default:
            echo json_encode(["error" => "Invalid request"]);
    }
}
// Route: /messages
elseif ($path[0] === "messages" && isset($path[1])) {
    $conversationId = $path[1];
    switch ($method) {
        case "GET":
            getMessagesByConversation($pdo, $conversationId);  // Fetch messages for specific conversation
            break;
        default:
            echo json_encode(["error" => "Invalid request"]);
    }
}
// Default Invalid Route
else {
    echo json_encode(["error" => "Invalid endpoint"]);
}

// Function to fetch all users
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

// Function to add a new user
function addUser($pdo, $data) {
    if (!isset($data["username"], $data["email"], $data["info"], $data["gender"], $data["media"])) {
        echo json_encode(["error" => "Missing required fields"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO user (username, email, info, gender, media) VALUES (:username, :email, :info, :gender, :media)");
        $stmt->execute([
            ":username" => $data["username"],
            ":email" => $data["email"],
            ":info" => $data["info"],
            ":gender" => $data["gender"],
            ":media" => json_encode($data["media"]) // Convert media to JSON string
        ]);

        echo json_encode(["message" => "User added successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Function to fetch all conversations
function getAllConversations($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT c.ConversationId, c.SenderId, c.RecipientId, u1.username AS sender_username, u2.username AS recipient_username
                               FROM conversation c
                               JOIN user u1 ON u1.id = c.SenderId
                               JOIN user u2 ON u2.id = c.RecipientId");
        $stmt->execute();
        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($conversations as &$conversation) {
            $conversation["messages"] = getMessagesForConversation($pdo, $conversation["ConversationId"]);
        }

        echo json_encode($conversations);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

// Function to fetch messages for a specific conversation
function getMessagesByConversation($pdo, $conversationId) {
    try {
        $stmt = $pdo->prepare("SELECT m.MessageId, m.SenderId, m.RecipientId, m.content, m.timestamp, u1.username AS sender_username, u2.username AS recipient_username
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

// Function to fetch messages for a conversation (helper function)
function getMessagesForConversation($pdo, $conversationId) {
    try {
        $stmt = $pdo->prepare("SELECT m.MessageId, m.SenderId, m.RecipientId, m.content, m.timestamp, u1.username AS sender_username, u2.username AS recipient_username
                               FROM message m
                               JOIN user u1 ON u1.id = m.SenderId
                               JOIN user u2 ON u2.id = m.RecipientId
                               WHERE m.ConversationId = :conversationId
                               ORDER BY m.timestamp");
        $stmt->execute([":conversationId" => $conversationId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return ["error" => "Database error: " . $e->getMessage()];
    }
}
?>
