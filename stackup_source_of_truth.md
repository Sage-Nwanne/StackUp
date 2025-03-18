# StackUp Source of Truth Document

## Project Overview
**StackUp** is a **Trello-like task management application** built using the **MERN stack**. It provides users with the ability to create, manage, and organize boards, lists, and cards in a **drag-and-drop** interface.

### **Tech Stack**
- **Frontend:** React, Tailwind CSS, React DnD
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Hosting:** Netlify (Frontend), Heroku (Backend)
- **State Management:** React Context API

---

## **Core Features**
### **User Authentication**
- Secure login and signup using JWT.
- Passwords stored securely with bcrypt.
- Protected API routes.

### **Board Management**
- Users can create, update, and delete boards.
- Boards contain multiple lists.

### **List Management**
- Lists belong to boards and contain cards.
- Lists can be reordered within boards.

### **Card Management**
- Cards belong to lists and can be moved across lists.
- Users can add labels, due dates, and descriptions to cards.

### **Activity Logging**
- Track and log board actions.

---

## **Project Structure**
### **Backend (Node.js & Express)**
```
backend/
│── models/        # Mongoose schemas
│── routes/        # Express route handlers
│── controllers/   # Business logic for API endpoints
│── middleware/    # Authentication and validation middleware
│── config/        # Environment variables and configuration
│── server.js      # Main entry point for Express app
```

### **Frontend (React)**
```
frontend/
│── src/
│   │── components/    # Reusable UI components
│   │── pages/         # Page-level components
│   │── context/       # React Context API state management
│   │── hooks/         # Custom React hooks
│   │── utils/         # Utility functions
│   │── App.js         # Main entry point for React app
│   │── index.js       # Root React render file
│   │── styles/        # Tailwind CSS styles
```

---

## **Tailwind CSS Configuration**
### **Global Styles**
```css
/* Tailwind CSS Configuration for StackUp */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Components */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700;
  }

  .btn-secondary {
    @apply bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700;
  }

  .card {
    @apply bg-white shadow-md rounded-lg p-4 border border-gray-200;
  }

  .board {
    @apply bg-gray-100 p-4 rounded-lg shadow-md w-full;
  }

  .list {
    @apply bg-gray-200 p-3 rounded-lg shadow-md w-64 min-h-[300px];
  }

  .card-item {
    @apply bg-white p-2 rounded-lg shadow cursor-pointer;
  }

  .dragging {
    @apply opacity-50;
  }
}

/* Dark Mode */
@layer utilities {
  .dark-mode {
    @apply bg-gray-900 text-white;
  }

  .dark-mode .card {
    @apply bg-gray-800 text-gray-300;
  }

  .dark-mode .board {
    @apply bg-gray-700;
  }
}
```

---

## **Deployment Process**
### **Backend Deployment (Heroku)**
```
```

### **Frontend Deployment (Netlify)**
```
```

---

## **Future Enhancements**
- **User Collaboration:** Share boards with other users.
- **Notifications:** Email or push notifications for task updates.
- **Real-time Updates:** Use WebSockets for live board updates.
- **Offline Mode:** Allow users to make changes while offline and sync later.

---

## **Conclusion**
This document serves as the **source of truth** for the StackUp project, providing all necessary details about its architecture, API structure, development workflow, and deployment process. Developers should reference this document to ensure consistency and maintainability throughout the project lifecycle.
