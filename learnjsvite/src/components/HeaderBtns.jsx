import { Link } from 'react-router-dom';

const HeaderBtns = ({ data, taskId }) => {
  let isNext = false;
  let isPrev = false;
  if (Number(taskId) !== 1) {
    isPrev = true;
  }
  data.forEach((item) => {
    if (Number(taskId) + 1 === Number(item.attributes.selfId)) {
      isNext = true;
    }
  });

  return (
    <div className="fixed left-1/2 top-4 flex w-full max-w-[600px] -translate-x-1/2 items-center justify-between gap-4 px-4">
      {isPrev && (
        <Link
          to={`/task/${Number(taskId) - 1}`}
          className="w-full rounded-md bg-white px-4 py-2 text-center text-lg font-bold text-black">
          PREVIOUS TASK
        </Link>
      )}
      {!isPrev && <button className="w-full rounded-md bg-white/50 px-4 py-2 text-center text-lg font-bold text-black">PREVIOUS TASK</button>}
      {isNext && (
        <Link
          to={`/task/${Number(taskId) + 1}`}
          className="w-full rounded-md bg-white px-4 py-2 text-center text-lg font-bold text-black">
          NEXT TASK
        </Link>
      )}
      {!isNext && <button className="w-full rounded-md bg-white/50 px-4 py-2 text-center text-lg font-bold text-black">NEXT TASK</button>}
    </div>
  );
};

export default HeaderBtns;
