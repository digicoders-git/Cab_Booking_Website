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
           <img src={blog.image} alt={blog.title} className="w-full h-[500px] object-cover rounded-xl shadow-lg mb-8" />
           
           <div className="flex gap-4 text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider border-b pb-6">
              <span>Date: {blog.date}</span>
              <span>/</span>
              <span>Author: {blog.author}</span>
           </div>

           <h2 className="text-3xl font-bold mb-6">{blog.title}</h2>
           
           <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
             <p className="mb-6">{blog.excerpt}</p>
             <p className="mb-6">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
             </p>
             <h3 className="text-2xl font-bold mt-8 mb-4">Why is this important?</h3>
             <p className="mb-6">
               Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
             </p>
             <blockquote className="border-l-4 border-primary pl-4 italic text-xl my-8 text-gray-600 bg-gray-50 p-4 rounded-r-lg">
               "The journey of a thousand miles begins with a single step."
             </blockquote>
             <p className="mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
             </p>
           </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
