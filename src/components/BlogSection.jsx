import { motion } from 'framer-motion';
import { blogs } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaRegCalendarAlt, FaArrowRight } from 'react-icons/fa';

const BlogSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[13px]">
            OUR BLOG
          </span>
          <h2 className="text-[38px] md:text-[46px] font-bold text-[#111111] mt-1 mb-4">
            Latest News & Blog
          </h2>
          {/* Custom Yellow Line Divider */}
          <div className="flex justify-center items-center gap-1">
            <div className="w-12 h-[3px] bg-primary"></div>
            <div className="w-10 h-2 rounded-full border-[2px] border-primary"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-[30px] p-6 shadow-[0px_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0px_15px_60px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-50 h-full flex flex-col">
                
                {/* Image Container */}
                <div className="rounded-[25px] overflow-hidden mb-6 h-[220px] relative">
                  <img 
                    src={`/blog${index + 1}.jpg`} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Meta Data */}
                <div className="flex items-center gap-6 mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-primary text-[18px]" />
                    <span className="text-[14px] font-bold text-[#111111]">By Alicia Davis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegCalendarAlt className="text-primary text-[16px]" />
                    <span className="text-[14px] font-bold text-[#111111]">February 23, 2023</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[22px] font-bold text-[#111111] leading-tight mb-8 px-2 group-hover:text-primary transition-colors duration-300 flex-1">
                  <Link to={`/blog/${blog.id}`}>
                    There Are Many Variations Of Passage Available.
                  </Link>
                </h3>

                {/* Button */}
                <div className="px-2 pb-2">
                  <Link 
                    to={`/blog/${blog.id}`} 
                    className="inline-flex items-center gap-2 bg-primary text-[#111111] font-black text-[13px] px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-all duration-300 shadow-md"
                  >
                    Read More
                    <FaArrowRight className="text-[12px]" />
                  </Link>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
