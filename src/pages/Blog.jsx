import PageHeader from '../components/PageHeader';
import BlogSection from '../components/BlogSection';
import CTASection from '../components/CTASection';

const Blog = () => {
  return (
    <>
      <PageHeader title="Latest News" breadcrumb="Blog" />
      
      <BlogSection />
      
      <CTASection />
    </>
  );
};

export default Blog;
