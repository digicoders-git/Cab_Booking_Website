import { motion } from 'framer-motion';
import { blogs } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRegCalendarAlt, FaUser } from 'react-icons/fa';

const BlogSection = () => {
  return (
    <section className="section-padding bg-[#0D0D0D] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="section-tag">
              <span className="w-4 h-px bg-primary" /> Our Blog
            </span>
            <h2 className="section-title">Latest News</h2>
          </div>
          <Link to="/blog" className="flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all">
            View all posts <FaArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-[#111111] border border-white/8 hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={`/blog${index + 1}.jpg`}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <FaUser size={10} className="text-primary" /> {blog.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <FaRegCalendarAlt size={10} className="text-primary" /> {blog.date}
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg leading-snug mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h3>

                <p className="text-white/40 text-sm leading-relaxed mb-5 line-clamp-2">{blog.excerpt}</p>

                <Link
                  to={`/blog/${blog.id}`}
                  className="flex items-center gap-2 text-primary text-xs font-bold hover:gap-3 transition-all"
                >
                  Read More <FaArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
