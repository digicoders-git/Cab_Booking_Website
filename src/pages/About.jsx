import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import ExpertDrivers from '../components/ExpertDrivers';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

const About = () => {
  return (
    <>
      <PageHeader title="About Us" breadcrumb="About" />
      
      <AboutSection />
      
      <StatsSection />
      
      <ExpertDrivers />
      
      <Testimonials />
      
      <CTASection />
    </>
  );
};

export default About;
