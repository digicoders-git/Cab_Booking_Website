import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { requestForToken, onMessageListener } from './firebase';
import { API_BASE_URL } from './config/api';
import Loader from './components/Loader';
import MainLayout from './layout/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Fleet from './pages/Fleet';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import RideType from './pages/RideType';
import SeatSelection from './pages/SeatSelection';
import AutoMatching from './pages/AutoMatching';
import FareCalculation from './pages/FareCalculation';
import BookingSummary from './pages/BookingSummary';
import Faq from './pages/Faq';
import Reviews from './pages/Reviews';
import Team from './pages/Team';
import AdvancedPayment from './pages/AdvancedPayment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBooking from './pages/MyBooking';
import BookingDetails from './pages/BookingDetails';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword';
import DriverTracking from './pages/DriverTracking';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import BulkBooking from './pages/BulkBooking';
import MyBulkBookings from './pages/MyBulkBookings';
import MyTransactions from './pages/MyTransactions';
import NotFound from './pages/NotFound';

function App() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('visited'));

  useEffect(() => {
    // 🔥 FCM Integration for User
    const setupFCM = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const fcmToken = await requestForToken();
      console.log("Current Rider FCM Token:", fcmToken);
      
      if (fcmToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/users/update-fcm-token`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ fcmToken })
          });
          const data = await res.json();
          console.log("FCM Update Response:", data);
          if (data.success) {
            console.log("Rider FCM Token updated on backend successfully. ✅");
          } else {
            console.error("Backend failed to update FCM Token: ❌", data.message);
          }
        } catch (error) {
          console.error("Error updating user FCM token:", error);
        }
      } else {
        console.warn("FCM Token was not obtained (User might have denied permission). ⚠️");
      }
    };

    setupFCM();

    // Listen for foreground messages
    const unsubscribeFCM = onMessageListener((payload) => {
      console.log('User Notification:', payload);
      // You could show a custom toast here if needed
    });

    return () => {
      if (unsubscribeFCM) unsubscribeFCM();
    };
  }, []);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('visited', '1');
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booking" element={<Booking />} />
          <Route path="services/ride-type" element={<RideType />} />
          <Route path="services/seat-selection" element={<SeatSelection />} />
          <Route path="services/auto-matching" element={<AutoMatching />} />
          <Route path="services/fare-calculation" element={<FareCalculation />} />
          <Route path="services/booking-summary" element={<BookingSummary />} />
          <Route path="faq" element={<Faq />} />
          <Route path="testimonials" element={<Reviews />} />
          <Route path="team" element={<Team />} />
          <Route path="advanced-payment" element={<AdvancedPayment />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          <Route path="my-booking" element={<MyBooking />} />
          <Route path="booking-details/:bookingId" element={<BookingDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="driver-tracking/:bookingId" element={<DriverTracking />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="bulk-booking" element={<BulkBooking />} />
          <Route path="my-bulk-bookings" element={<MyBulkBookings />} />
          <Route path="my-transactions" element={<MyTransactions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
