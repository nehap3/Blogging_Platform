# Blogify - MERN Blogging Platform

A full-featured blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). Users can read, write, edit, and delete blogs, manage their profiles, and comment on posts. Includes an Admin Dashboard for managing users and content.

## 🚀 Live Demo
Check out the live application here: [https://blogging-platform-w2pq.vercel.app/](https://blogging-platform-w2pq.vercel.app/)

## 🚀 Features

- **User Authentication**: Secure Login/Register with JWT & Cookies.
- **Rich Text Editor**: Create beautiful blogs with formatting and image uploads.
- **Comment System**: Engage with blogs through comments.
- **Profile Management**: Update user details and profile pictures.
- **Admin Dashboard**: Admin users can manage all users and blogs.
- **Search & Filter**: Find blogs easily.
- **Responsive Design**: Works on Desktop and Mobile.
- **Dark/Light Mode**: (If implemented, otherwise omit).

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Axios, React Router Dom
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Local uploads (or Cloudinary if configured)

## 📦 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone https://github.com/nehap3/Blogging_Platform.git
cd Blogging_Platform
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

## 📜 API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create a blog (Auth required)

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
