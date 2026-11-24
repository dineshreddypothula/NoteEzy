# NoteEzy — Real-Time Collaborative Editor

A full-stack real-time collaborative note-taking application that enables multiple users to simultaneously create, edit, and format documents in shared rooms. Features secure authentication, live synchronization, and an integrated AI assistant.

---

## 🎯 Problem Statement

Traditional note-taking tools lack real-time collaboration capabilities. Teams need a seamless way to work together on documents without version conflicts, with instant visibility into changes made by others. NoteEzy solves this by providing a Google Docs-like experience with rooms-based organization, secure access control, and AI-enhanced productivity features.

---

## ✨ Features

### Core Collaboration
- **Real-Time Synchronization** — Changes appear instantly across all connected clients using Socket.IO
- **Room-Based Organization** — Create private rooms for projects, teams, or topics
- **Live Presence** — See who's currently in the room with cursor tracking
- **Rich Text Editing** — Full formatting support (bold, italic, headings, lists, code blocks)

### Authentication & Security
- **Email/Password Registration** — Secure signup with password hashing
- **Google OAuth 2.0** — One-click sign-in with Google accounts
- **JWT Authentication** — Stateless auth with access/refresh tokens
- **Protected Routes** — Server-side validation on all API endpoints

### AI-Enhanced Productivity
- **Integrated AI Chat Assistant** — Brainstorm, generate content, summarize notes
- **Context-Aware Responses** — AI understands current document content

### User Experience
- **Responsive Design** — Works on desktop and mobile
- **Dark/Light Theme** — System-aware theme switching
- **Auto-Save** — Changes persisted automatically

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js, Express, MongoDB + Mongoose |
| **Real-Time** | Socket.IO (rooms, events, broadcasting) |
| **Authentication** | Passport.js (Local + Google OAuth), JWT, bcryptjs |
| **Database** | MongoDB (documents, rooms, users) |
| **Deployment** | Netlify (frontend), Render/Railway (backend) |

---

## 🏗️ Architecture

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│   Next.js       │ ◄─────────────────► │   Express +     │
│   Frontend      │    Socket.IO        │   Socket.IO     │
│                 │                     │   Backend       │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         │ HTTP/REST                             │ Mongoose
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│   Browser       │                     │   MongoDB       │
│   (Client)      │                     │   (Database)    │
└─────────────────┘                     └─────────────────┘
```

**Data Flow:**
1. User joins room → Socket.IO connection established
2. Document edits → Emitted to server → Broadcast to room members
3. Server persists to MongoDB → Acknowledges to clients
4. AI requests → REST API → External AI service → Response

---

## 📁 Project Structure

```
NoteEzy/
├── client/                      # Next.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── dashboard/       # User dashboard (rooms list)
│   │   │   ├── room/[id]/       # Collaborative editor page
│   │   │   ├── login/           # Authentication pages
│   │   │   ├── signup/
│   │   │   └── layout.js        # Root layout with providers
│   │   ├── components/          # React components
│   │   │   ├── editor/          # Rich text editor components
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── auth/            # Auth forms
│   │   │   └── room/            # Room-specific components
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useSocket.js     # Socket.IO connection
│   │   │   ├── useAuth.js       # Authentication state
│   │   │   └── useEditor.js     # Editor state management
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.js           # API client (Axios)
│   │   │   └── socket.js        # Socket.IO client config
│   │   └── store/               # State management (if used)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local.example
│
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── roomController.js
│   │   │   └── aiController.js
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── validation.js    # Input validation
│   │   │   └── errorHandler.js  # Error handling
│   │   ├── models/              # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   └── Message.js       # (if chat messages stored)
│   │   ├── routes/              # API route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── roomRoutes.js
│   │   │   └── aiRoutes.js
│   │   ├── socket/              # Socket.IO handlers
│   │   │   ├── connection.js    # Connection handling
│   │   │   ├── roomEvents.js    # Room join/leave/sync
│   │   │   └── editorEvents.js  # Real-time editing
│   │   ├── config/              # Configuration
│   │   │   ├── passport.js      # Passport strategies
│   │   │   └── db.js            # MongoDB connection
│   │   └── utils/               # Helpers
│   │       ├── jwt.js           # Token utilities
│   │       └── ai.js            # AI service integration
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MongoDB** 6+ (local or MongoDB Atlas)
- **Google Cloud Console** project (for OAuth)
- **npm** or **yarn**

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_CONNECTION_URL=mongodb://localhost:27017/noteezy

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# AI Service (optional)
AI_API_KEY=your_ai_api_key
AI_API_URL=https://api.openai.com/v1
```

Start backend:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env.local` in `client/`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Start frontend:

```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/google` | Initiate Google OAuth |
| `GET` | `/api/auth/google/callback` | OAuth callback |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/refresh` | Refresh access token |

### Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rooms` | Create new room |
| `GET` | `/api/rooms` | List user's rooms |
| `GET` | `/api/rooms/:id` | Get room details |
| `PATCH` | `/api/rooms/:id` | Update room settings |
| `DELETE` | `/api/rooms/:id` | Delete room |
| `POST` | `/api/rooms/:id/join` | Join room |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | Send message to AI |

---

## 🔌 Socket.IO Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomId, userId }` | Join a room |
| `leave-room` | `{ roomId }` | Leave current room |
| `editor-change` | `{ roomId, content, version }` | Document edit |
| `cursor-move` | `{ roomId, position, userId }` | Cursor position |
| `request-sync` | `{ roomId }` | Request full document sync |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `room-joined` | `{ room, users }` | Room joined successfully |
| `user-joined` | `{ userId, username }` | New user joined |
| `user-left` | `{ userId }` | User left room |
| `editor-update` | `{ content, version, userId }` | Document updated |
| `cursor-update` | `{ userId, position, username }` | Cursor moved |
| `sync-document` | `{ content, version }` | Full document sync |
| `error` | `{ message }` | Error notification |

---

## 🔐 Authentication Flow

```
1. User visits /login or /signup
2. Credentials sent to /api/auth/login or /api/auth/signup
3. Server validates → creates user → issues JWT access + refresh tokens
4. Tokens stored in HttpOnly cookies (secure, sameSite)
5. Protected routes: middleware verifies JWT → attaches user to req
6. Socket.IO: token sent in handshake auth → validated on connection
7. Google OAuth: redirect to Google → callback → JWT issued
```

---

## 🎨 Key Implementation Details

### Real-Time Editing (Operational Transformation Lite)
- Each edit carries a version number
- Server applies edits sequentially, broadcasts with incremented version
- Clients acknowledge and update local version
- Conflict resolution: last-write-wins with version checking

### Room Management
- Rooms owned by creator, can add collaborators
- Private by default, join via invite or link
- Room metadata: title, description, createdAt, updatedAt

### AI Integration
- Context: current document content + user query
- Streaming responses for better UX
- Rate limiting per user

### Security Measures
- Helmet.js headers
- CORS restricted to FRONTEND_URL
- Rate limiting on auth endpoints
- Input validation (express-validator)
- Password hashing (bcryptjs, 12 rounds)
- JWT short expiry (7d), refresh rotation
- MongoDB injection prevention

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test  # (add Jest + Supertest)

# Frontend
cd client
npm test  # (add Jest + React Testing Library)
npm run lint
```

**Recommended test coverage:**
- Auth: signup, login, token refresh, OAuth flow
- Rooms: CRUD, join/leave, permissions
- Real-time: sync, concurrent edits, reconnection
- AI: chat endpoint, error handling

---

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables in provider dashboard
2. Build command: `npm install`
3. Start command: `npm start`
4. Ensure MongoDB Atlas connection string in `MONGODB_CONNECTION_URL`

### Frontend (Netlify/Vercel)
1. Connect repository
2. Build command: `npm run build`
3. Output directory: `.next` (Next.js) or `out` (static export)
4. Environment variables: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. Configure rewrites for Next.js App Router

### Domain & SSL
- Custom domain on Netlify/Vercel
- Update `FRONTEND_URL` in backend CORS
- Update Google OAuth authorized domains

---

## 🗺️ Roadmap

- [ ] **Operational Transformation** — Full OT/CRDT for conflict-free editing
- [ ] **Comments & Annotations** — Threaded comments on text selections
- [ ] **Version History** — Document snapshots with restore
- [ ] **Export** — PDF, Markdown, DOCX export
- [ ] **Mobile App** — React Native companion
- [ ] **Plugins** — Diagrams, tables, code blocks
- [ ] **Team Workspaces** — Organization-level room management
- [ ] **E2E Tests** — Playwright/Cypress for critical flows
- [ ] **CI/CD** — GitHub Actions for lint, test, build, deploy

---

## 📄 License

MIT License — feel free to use and modify.

---

## 👨‍💻 Author

**Dinesh Reddy Pothula**  
Full Stack Developer • Data Analytics • Problem Solver  

[GitHub](https://github.com/dineshreddypothula) • [LinkedIn](https://www.linkedin.com/in/dinesh-reddy-pothula/) • [LeetCode](https://leetcode.com/PDineshreddy84/)