import PageHeader from '../components/PageHeader';
import CarFleet from '../components/CarFleet';
import CTASection from '../components/CTASection';

const Fleet = () => {
  return (
    <>
      <PageHeader title="Our Fleet" breadcrumb="Fleet" />
      
      <CarFleet />
      
      <CTASection />
    </>
  );
};

export default Fleet;
