const useTask = () => {
  const task = 'Create a Function to Calculate the Sum of Two Numbers';

  const functionName = 'sum';
  const code = `function ${functionName}(a, b) {
    // return sum of a and b
    return 1;
  }`;

  const testCode = `function tests(isEqual, helloWorld) {
      return [
        {
          isPassed: isEqual("Hello World", helloWorld()),
          shouldBe: "Hello World",
          func: 'helloWorld()',
          returned: helloWorld()
        }
      ];
    }`;

  return {
    task,
    functionName,
    code,
    testCode,
  };
};

export default useTask;
