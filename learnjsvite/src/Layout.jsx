import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

function Layout() {
  return (
    <>
      <div className="relative grid h-[90vh] place-items-center bg-black">
        <div className="flex w-full justify-center p-4 py-10">
          <Outlet />
        </div>
      </div>
      <Toaster />
      <Footer />
    </>
  );
}

export default Layout;
