import BookingForm from '../components/BookingForm';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import CarFleet from '../components/CarFleet';
import WhyChooseUs from '../components/WhyChooseUs';
import ExpertDrivers from '../components/ExpertDrivers';
import QualityServiceSection from '../components/QualityServiceSection';
import FaqSection from '../components/FaqSection';
import AppDownload from '../components/AppDownload';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import PartnersSection from '../components/PartnersSection';
import CTASection from '../components/CTASection';

const Home = () => {
  return (
    <>
      <BookingForm />
      <AboutSection />
      <ServicesSection />
      <CarFleet />
      <WhyChooseUs />
      {/* <ExpertDrivers /> */}
      <QualityServiceSection />
      <FaqSection />
      {/* <AppDownload /> */}
      <Testimonials />
      <BlogSection />
      <PartnersSection />
      <CTASection />
    </>
  );
};

export default Home;
