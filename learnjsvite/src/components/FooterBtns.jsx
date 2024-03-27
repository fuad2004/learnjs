const FooterBtns = ({ setActiveScreen }) => {
  return (
    <div className="fixed bottom-10 left-1/2 flex w-full max-w-[600px] -translate-x-1/2 items-center justify-between gap-4 px-4">
      <button
        onClick={() => setActiveScreen('task')}
        className="w-full rounded-md bg-white px-4 py-2 text-lg font-bold text-black">
        TASK
      </button>
      <button
        onClick={() => setActiveScreen('code')}
        className="w-full rounded-md bg-white px-4 py-2 text-lg font-bold text-black">
        CODE
      </button>
      <button
        onClick={() => setActiveScreen('output')}
        className="w-full rounded-md bg-white px-4 py-2 text-lg font-bold text-black">
        OUTPUT
      </button>
    </div>
  );
};

export default FooterBtns;
