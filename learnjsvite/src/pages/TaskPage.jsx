import { useState, useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Task from '../components/Task';

import Sandbox from '@nyariv/sandboxjs';

import CodeMirror from '@uiw/react-codemirror';
import { githubDarkInit } from '@uiw/codemirror-theme-github';
import { javascript } from '@codemirror/lang-javascript';

import js_beautify from 'js-beautify';
import { isEqual } from 'lodash';

import Output from '../components/Output';
import FooterBtns from '../components/FooterBtns';
import useSWR from 'swr';
import qs from 'qs';
import toast from 'react-hot-toast';
import HeaderBtns from '../components/HeaderBtns';

const TaskPage = () => {
  const { taskId } = useParams();
  if (Object.is(Number(taskId), NaN)) {
    throw new Response('Bad Request', { status: 404 });
  }
  let location = useLocation();

  const fetcher = ([url, ...args]) => fetch(url, ...args).then((res) => res.json());
  const query = qs.stringify({
    filters: {
      selfId: {
        $eq: Number(taskId),
      },
    },
  });
  const queryV2 = qs.stringify({
    fields: ['selfId'],
  });
  const { data, error, isLoading } = useSWR(
    [
      `${import.meta.env.VITE_API_URL}/tasks?${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      },
    ],
    fetcher
  );
  const {
    data: dataV2,
    error: errorV2,
    isLoading: isLoadingV2,
  } = useSWR(
    [
      `${import.meta.env.VITE_API_URL}/tasks?${queryV2}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      },
    ],
    fetcher
  );

  function beautifyCode(code) {
    return js_beautify.js(code, { indent_size: 2, space_in_empty_paren: true, max_preserve_newlines: 2 });
  }
  const [value, setValue] = useState('');

  useEffect(() => {
    const submittedCode = localStorage.getItem(`task${taskId}`);
    if (submittedCode !== null) {
      setValue(beautifyCode(submittedCode));
    } else if (!isLoading && !error && data.data[0] !== undefined) setValue(beautifyCode(data.data[0].attributes.code));
  }, [data, dataV2]);

  // Code Value
  const [activeScreen, setActiveScreen] = useState('task');
  // task // output // code

  // If location changed setActiveScreen to default (task)
  useEffect(() => {
    setActiveScreen('task');
  }, [location]);

  const [timePassed, setTimePassed] = useState(0);
  const [passed, setPassed] = useState(0);
  const [failed, setFailed] = useState(0);
  const [outputState, setOutputState] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [err, setErr] = useState({ name: '', msg: '', hasErr: false });

  // Code Change
  const onChange = useCallback((val) => {
    setValue(val);
  }, []);

  // RUN CODE
  async function handleRun() {
    setActiveScreen('output');
    const code = value;
    const globals = { ...Sandbox.SAFE_GLOBALS };
    const prototypeWhitelist = Sandbox.SAFE_PROTOTYPES;
    const sandbox = new Sandbox({ globals, prototypeWhitelist });
    function runCode() {
      setPassed(0);
      setFailed(0);
      setErr({ name: '', msg: '', hasErr: false });
      setTimePassed(0);

      const funcs = {};
      const testingFunc = { tests: () => {} };

      let exec, testExec;
      try {
        exec = sandbox.compile(code);
      } catch (e) {
        setErr({ name: e.name, msg: e.message, hasErr: true });
        setOutputState(false);
        return 1;
      }

      try {
        testExec = sandbox.compile(beautifyCode(data.data[0].attributes.testCode));
      } catch (e) {
        setErr({ name: e.name, msg: e.message, hasErr: true });
        setOutputState(false);
        return 1;
      }

      try {
        exec(funcs).run();
        setOutputState(true);
      } catch (e) {
        setErr({ name: e.name, msg: e.message, hasErr: true });
        setOutputState(false);
        return 1;
      }
      try {
        testExec(testingFunc).run();
        setOutputState(true);
      } catch (e) {
        setErr({ name: e.name, msg: e.message, hasErr: true });
        setOutputState(false);
        return 1;
      }

      const startTime = new Date();
      let results;
      try {
        results = testingFunc.tests(isEqual, funcs[data.data[0].attributes.functionName]);
        setTestResults(results);
        setOutputState(true);
      } catch (e) {
        setErr({ name: e.name, msg: e.message, hasErr: true });
        setOutputState(false);
        return 1;
      }
      const endTime = new Date();
      const timeDiff = endTime - startTime;
      setTimePassed(timeDiff);

      results.forEach((test) => {
        if (test.isPassed()) {
          setPassed((prev) => (prev += 1));
        } else {
          setFailed((prev) => (prev += 1));
          setOutputState(false);
        }
      });
    }
    runCode();
  }

  // SUBMIT CODE
  async function handleSubmit() {
    const code = value;
    const globals = { ...Sandbox.SAFE_GLOBALS };
    const prototypeWhitelist = Sandbox.SAFE_PROTOTYPES;
    const sandbox = new Sandbox({ globals, prototypeWhitelist });

    const funcs = {};
    const testingFunc = { tests: () => {} };

    let exec, testExec;
    try {
      exec = sandbox.compile(code);
    } catch (e) {
      toast.error('Wrong!', {
        id: 'wrong',
      });
      return 1;
    }

    try {
      testExec = sandbox.compile(beautifyCode(data.data[0].attributes.testCode));
    } catch (e) {
      toast.error('Wrong!', {
        id: 'wrong',
      });
      return 1;
    }

    try {
      exec(funcs).run();
    } catch (e) {
      toast.error('Wrong!', {
        id: 'wrong',
      });
      return 1;
    }
    try {
      testExec(testingFunc).run();
    } catch (e) {
      toast.error('Wrong!', {
        id: 'wrong',
      });
      return 1;
    }

    let results;
    try {
      results = testingFunc.tests(isEqual, funcs[data.data[0].attributes.functionName]);
    } catch (e) {
      toast.error('Wrong!', {
        id: 'wrong',
      });
      return 1;
    }

    let isPassed = true;
    results.forEach((test) => {
      if (!test.isPassed()) {
        isPassed = false;
      }
    });
    if (isPassed) {
      toast.success('You passed task!', {
        id: 'taskPassed',
      });
      localStorage.setItem(`task${taskId}`, value);
    } else {
      toast.error('Wrong!', {
        id: 'wrong',
      });
    }
  }

  function handleFormatting() {
    const formattedCode = js_beautify.js(value, { indent_size: 2, space_in_empty_paren: true, max_preserve_newlines: 2 });
    setValue(formattedCode);
  }

  // Resetting almost all states
  function handleReset() {
    setValue(js_beautify.js(data.data[0].attributes.code, { indent_size: 2, space_in_empty_paren: true, max_preserve_newlines: 2 }));
    setOutputState(null);
    setTimePassed(0);
    setPassed(0);
    setFailed(0);
    setTestResults([]);
    setErr({ name: '', msg: '', hasErr: false });
  }

  if (isLoading || isLoadingV2) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else if (data === undefined || dataV2 === undefined || error || data.data[0] === undefined) {
    throw new Response('Bad Request', { status: 404 });
  } else if (!isLoading && !isLoadingV2) {
    return (
      <>
        <HeaderBtns
          data={dataV2.data}
          taskId={taskId}
        />
        <div
          style={{ display: activeScreen === 'code' ? '' : 'none' }}
          className="flex w-full flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleReset()}
              className="w-fit rounded-md border border-solid border-zinc-100/10 bg-zinc-900 px-3 py-1 text-lg font-semibold text-white">
              RESET
            </button>
            <button
              onClick={() => handleSubmit()}
              className="w-full rounded-md border border-solid border-zinc-100/10 bg-zinc-900 px-3 py-1 text-lg font-semibold text-white">
              SUBMIT
            </button>
            <button
              onClick={() => handleRun()}
              className="w-full rounded-md border border-solid border-zinc-100/10 bg-zinc-900 px-3 py-1 text-lg font-bold text-white">
              RUN
            </button>
          </div>
          <button
            onClick={() => handleFormatting()}
            className="w-full rounded-md bg-white px-3 py-1 text-lg font-semibold text-black">
            BEAUTIFY
          </button>
          <div className="h-[400px] w-full max-w-[calc(100vw-32px)] text-sm">
            <CodeMirror
              value={value}
              height="400px"
              theme={githubDarkInit({
                settings: {
                  background: '#18181b', // zinc-900
                  gutterBackground: '#18181b', // zinc-900
                },
              })}
              extensions={[javascript()]}
              onChange={onChange}
            />
          </div>
        </div>
        <Output
          activeScreen={activeScreen}
          outputState={outputState}
          timePassed={timePassed}
          passed={passed}
          failed={failed}
          err={err}
          testResults={testResults}
        />
        <Task
          id={taskId}
          taskText={data.data[0].attributes.task}
          displayParam={activeScreen === 'task'}
        />
        <FooterBtns setActiveScreen={setActiveScreen} />
      </>
    );
  }
};

export default TaskPage;
