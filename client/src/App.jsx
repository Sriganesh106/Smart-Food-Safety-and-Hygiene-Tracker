import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import NewRestaurant from './pages/NewRestaurant';
import EditRestaurant from './pages/EditRestaurant';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/restaurants/new" element={<NewRestaurant />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/restaurants/:id/edit" element={<EditRestaurant />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Chatbot />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
