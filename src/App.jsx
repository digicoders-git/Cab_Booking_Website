import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import NotFound from './pages/NotFound';

function App() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('visited'));

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
          <Route path="booking-details" element={<BookingDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="driver-tracking" element={<DriverTracking />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
