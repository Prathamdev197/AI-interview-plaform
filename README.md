# InterviewAI — AI Technical Interview Platform

InterviewAI is a full-stack MERN application that helps developers practice technical interviews with AI. Candidates get real-time technical questions, instant AI scoring out of 10, voice reading, model answers, and history tracking.

---

## 🚀 Features

- **AI Technical Questions**: Generates 10 topic-specific technical questions using Gemini AI (MERN, React, Node.js, DSA, System Design).
- **Voice & Speech Support**: Reads questions aloud using Text-to-Speech and supports speech-to-text voice answers.
- **Instant AI Scoring & Feedback**: Evaluates candidate answers out of 10 with detailed feedback and ideal model answers.
- **User Dashboard**: Track past interview history, average scores, and total questions answered.
- **Authentication**: JWT-based secure user registration and login.
- **Mobile Responsive**: Clean dark theme UI optimized for all screen sizes with hamburger navigation.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose
- **AI Integration**: Google Gemini AI (`gemini-2.0-flash`)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js installed on your machine
- MongoDB Atlas database connection URI
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/Prathamdev197/AI-interview-platform.git
cd AI-interview-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start practicing!

---

## 📄 License
This project is open source under the ISC License.
