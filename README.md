# 🎵 MeetMyBand

**MeetMyBand** est une plateforme de mise en relation entre musiciens / artistes. L'application permet aux utilisateurs de créer un profil, d’échanger par chat et de démarrer des collaborations musicales.

## 🚀 Fonctionnalités

- Création de compte / Connexion (authentification JWT)
- Visualisation des profils utilisateurs
- Discussions via un système de messagerie (chat)
- Liste des conversations par utilisateur

## 🛠️ Technologies utilisées

### Frontend

- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- **Shadcn**
- **ReactRouter**

### Backend

- **PHP** (API REST)
- **JWT (firebase/php-jwt)** pour l’authentification
- **SQLite** (base de données légère, locale)

## 📁 Structure du projet (Backend)

```
/backend
│
├── db.php               → Connexion à la base de données SQLite
├── api.php            → Point d’entrée de l’API (routes)
├── /vendor              → Dépendances Composer (dont JWT)
└── message_app.db      → Base de données
```

## 📦 Installation & Lancement

### Backend

```bash
cd backend
composer install
php -S localhost:8000
```

> 📌 Le backend écoute sur `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> 📌 L’app sera dispo sur `http://localhost:5173`

## 🔌 Endpoints principaux de l’API

### 🔐 Authentification

- `POST /auth/register`  
  ➤ Crée un utilisateur

- `POST /auth/login`  
  ➤ Retourne un token JWT

### 👥 Utilisateurs

- `GET /users`  
  ➤ Liste tous les utilisateurs

- `POST /users`  
  ➤ Met à jour les infos d’un utilisateur

### 💬 Conversations

- `POST /conversations`  
  ➤ Liste les conversations d’un utilisateur (`userId` requis)

### ✉️ Messages

- `GET /messages/{conversationId}`  
  ➤ Retourne les messages d’une conversation

## 📷 Base de données

Le modèle de données comprend trois tables principales :

- `user` : informations des utilisateurs
- `conversation` : relations entre utilisateurs
- `message` : contenu échangé dans les discussions

## 📄 Licence

Projet réalisé dans le cadre d’un travail scolaire – librement réutilisable à des fins pédagogiques ou personnelles.
