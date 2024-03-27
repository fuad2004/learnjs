import { useState } from 'react';
import Triangle from '../svg/Triangle';

const Output = ({ activeScreen, timePassed, passed, failed, outputState, err, testResults }) => {
  const [open, setOpen] = useState(null);

  function handleOpen(index) {
    if (index === open) {
      setOpen(null);
    } else {
      setOpen(index);
    }
  }

  return (
    <div
      className={`grid h-[400px] w-full max-w-[calc(100vw-32px)] grid-rows-[min-content_1fr] rounded-md border-solid ${outputState === null ? 'border border-zinc-100/10' : !outputState ? 'border-2 border-red-500' : 'border-2 border-lime-500'} bg-zinc-900`}
      style={{ display: activeScreen === 'output' ? '' : 'none' }}>
      <div className="mb-2 flex items-center gap-3 border-b border-solid border-zinc-100/10 p-4 font-mono">
        <span className="text-sm font-normal text-white">Time: {timePassed}ms</span>
        <span className={`text-sm font-normal ${passed !== 0 ? 'text-green-600' : 'text-white'}`}>Passed: {passed}</span>
        <span className={`text-sm font-light ${failed !== 0 ? 'text-rose-600' : 'text-white'}`}>Failed: {failed}</span>
      </div>
      <div
        id="output"
        className="customScrollBar h-full overflow-auto p-4 font-mono text-sm font-normal text-white">
        {err.hasErr && (
          <div className="rounded-md border border-solid border-red-500 bg-red-500/10 px-4 py-2">
            <span className="text-base font-medium text-white">{err.name}: </span>
            <span className="text-sm font-normal text-white">{err.msg}</span>
          </div>
        )}
        {!err.hasErr && (
          <div className="flex flex-col gap-3">
            {testResults.map((result, index) => {
              if (!result.isPassed()) {
                return (
                  <div
                    key={index}
                    className="relative">
                    <div
                      onClick={() => handleOpen(index)}
                      className="flex cursor-pointer items-center justify-between rounded-md border border-solid border-red-500 bg-red-500/10 px-4 py-2">
                      <span className="text-sm font-normal text-white">test {index + 1}: Failed</span>
                      <Triangle className={`h-3 w-3 ${open === index ? 'rotate-0' : 'rotate-180'} fill-white transition-transform`} />
                    </div>
                    {open === index && (
                      <div className="flex flex-col rounded-md border border-solid border-red-500 bg-red-500/10 p-4">
                        <span className="text-sm font-normal text-white">
                          {result.func} should be {result.shouldBe}
                        </span>
                        <span className="text-sm font-normal text-white">
                          {result.func} is not equal to {result.returned}
                        </span>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="relative">
                    <div
                      onClick={() => handleOpen(index)}
                      className="flex cursor-pointer items-center justify-between rounded-md border border-solid border-green-500 bg-green-500/10 px-4 py-2">
                      <span className="text-sm font-normal text-white">test {index + 1}: Passed</span>
                      <Triangle className={`h-3 w-3 ${open === index ? 'rotate-0' : 'rotate-180'} fill-white transition-transform`} />
                    </div>
                    {open === index && (
                      <div className="rounded-md border border-solid border-green-500 bg-green-500/10 p-4">
                        <span className="text-sm font-normal text-white">
                          {result.func} is equal to {result.shouldBe}
                        </span>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
