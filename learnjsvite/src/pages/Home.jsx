import { Link } from 'react-router-dom';

const Home = () => {
  const shareData = {
    title: 'LearnJs',
    text: `Let's learn Javascript With Tasks`,
    url: 'https://learnjs.az',
  };

  function handleShare() {
    if (window !== null) {
      shareData.url = window.location.href;
      navigator.share(shareData);
    }
  }
  return (
    <div className="relative w-fit rounded-md border border-solid border-zinc-100/10 bg-zinc-900 p-6">
      <div className="mb-8 text-3xl font-bold text-white">
        Welcome to <span className="text-nowrap text-blue-500">LearnJs 🫡</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={'task/1'}
          className="rounded-md bg-white px-4 py-2 text-base font-bold text-black">
          GET STARTED
        </Link>
        <button
          onClick={() => handleShare()}
          className="rounded-md border border-solid border-zinc-100/10 bg-transparent px-4 py-2 text-base font-semibold text-white">
          SHARE WITH FRIEND
        </button>
      </div>
    </div>
  );
};

export default Home;
