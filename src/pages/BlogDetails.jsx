import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { blogs } from '../data/mockData';
import NotFound from './NotFound';

const BlogDetails = () => {
  const { id } = useParams();
  const blog = blogs.find(b => b.id === parseInt(id));

  if (!blog) {
    return <NotFound />;
  }

  return (
    <>
      <PageHeader title={blog.title} breadcrumb="Blog Details" />

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <img src={blog.image} alt={blog.title} className="w-full h-auto object-contain rounded-xl shadow-lg mb-8" />

          <div className="flex gap-4 text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider border-b pb-6">
            <span>Date: {blog.date}</span>
            <span>/</span>
            <span>Author: {blog.author}</span>
          </div>

          <h2 className="text-3xl font-bold mb-6">{blog.title}</h2>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-6">{blog.excerpt}</p>
            <p className="mb-6">
              At KwikCabs , we understand that reliable transportation is essential for modern living. Whether you're commuting to work, heading to the airport, or exploring the city, our professional drivers and well-maintained fleet ensure you reach your destination safely and comfortably. With real-time tracking and transparent pricing, we've revolutionized the way people travel.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">Why is this important?</h3>
            <p className="mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-xl my-8 text-gray-600 bg-gray-50 p-4 rounded-r-lg">
              "The journey of a thousand miles begins with a single step."
            </blockquote>
            <p className="mb-6">
              Our commitment to excellence goes beyond just providing rides. Every driver undergoes rigorous background checks and professional training to ensure your safety. We maintain our vehicles to the highest standards, offering everything from economy sedans to luxury SUVs. With 24/7 customer support and competitive pricing, KwikCabs  has become the trusted choice for thousands of riders across the city.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
