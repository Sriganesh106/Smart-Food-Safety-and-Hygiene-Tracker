# 🍽️ SafeEats: Smart Food Safety & Hygiene Tracker

![SafeEats Preview](https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80)

**SafeEats** is a comprehensive food safety monitoring platform enabling real-time hygiene tracking for restaurants across Bengaluru. Built with modern web technologies, it provides users and inspectors with intuitive tools to assess, monitor, and improve food safety standards.

## ✨ Key Features

- 📊 **Real-Time Hygiene Dashboard:** View dynamic hygiene scores (A-F) and critical violations for over 100+ tracked restaurants.
- 🗺️ **Live Map Integration:** Interactive map view powered by **MapBox** to visualize restaurant locations and hygiene ratings geographically.
- 💬 **AI Food Safety Assistant:** An integrated, intelligent chatbot powered by **Groq AI** and LLaMA 3.1 that answers context-aware questions about food safety and specific restaurant ratings.
- 🔐 **Role-Based Access:** 
  - **Admins:** Full control to add, edit, or remove restaurants and manage user reviews.
  - **Users:** Read-only access to restaurant data with the ability to submit inspection reviews.
- 📱 **Premium UI/UX:** A highly responsive, modern, and accessible user interface tailored for an exceptional user experience.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Maps:** MapBox GL JS
- **AI Integration:** Groq SDK (LLaMA 3.1)
- **Authentication:** Passport.js (Local Strategy)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine. You will also need a MongoDB database URL, a MapBox token, and a Groq API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sriganesh106/Smart-Food-Safety-and-Hygiene-Tracker.git
   cd Smart-Food-Safety-and-Hygiene-Tracker
   ```

2. **Install all dependencies:**
   *(The project is configured to run both frontend and backend concurrently)*
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   SECRET=your_session_secret
   ATLASDB_URL=your_mongodb_connection_string
   MAP_TOKEN=your_mapbox_access_token
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend will run on: `http://localhost:5000`

---
*Developed by Sriganesh.*
