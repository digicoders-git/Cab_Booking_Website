import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingAppButtons from '../components/FloatingAppButtons';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Header />
      <FloatingAppButtons />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
