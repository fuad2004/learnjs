import { Link } from 'react-router-dom';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 grid w-full place-items-center border border-zinc-100/10 bg-zinc-900 py-1">
      <div className="text-sm font-normal text-white">
        Made by{' '}
        <Link
          target="_blank"
          to="https://github.com/fuad2004"
          className="relative text-blue-500">
          FD
          <div className="absolute right-0 top-0 h-full w-0 bg-black">
            <div className={`${styles.blinkAnim} h-full w-0.5 rounded-full bg-blue-500`}></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
