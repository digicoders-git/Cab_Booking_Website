import PageHeader from '../components/PageHeader';
import ServicesSection from '../components/ServicesSection';
import CTASection from '../components/CTASection';

const Services = () => {
  return (
    <>
      <PageHeader title="Our Services" breadcrumb="Services" />
      
      <ServicesSection />
      
      <CTASection />
    </>
  );
};

export default Services;
