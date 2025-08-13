// Manual test script for setTimeout and debounce functionality
import { runCodeWorker } from "./src/lib/runCode.js";

console.log("Testing setTimeout functionality...");

const timeoutTestCode = `
console.log('Before setTimeout');
setTimeout(() => {
  console.log('setTimeout executed after 100ms');
}, 100);
console.log('After setTimeout');
`;

console.log("Running timeout test...");
try {
  const result = await runCodeWorker(timeoutTestCode, {
    injectLogs: false,
    timeoutWorker: 5000
  });
  
  console.log("Timeout test results:");
  result.forEach((log, index) => {
    console.log(`${index + 1}. ${log.content}`);
  });
  
  if (result.length === 3 && result[2].content.includes('setTimeout executed')) {
    console.log("✅ setTimeout test PASSED");
  } else {
    console.log("❌ setTimeout test FAILED");
  }
  
} catch (error) {
  console.error("Error running timeout test:", error);
}

console.log("\nTesting debounce functionality...");

const debounceTestCode = `
var debounce = function (fn, t) {
  let timerID;
  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
      fn.apply(this, args);
    }, t) 
  }
};

const log = debounce(console.log, 100);
log('Hello 1'); // should be cancelled
log('Hello 2'); // should be cancelled  
log('Hello 3'); // should be logged at t=100ms
`;

console.log("Running debounce test...");
try {
  const result = await runCodeWorker(debounceTestCode, {
    injectLogs: false,
    timeoutWorker: 5000
  });
  
  console.log("Debounce test results:");
  result.forEach((log, index) => {
    console.log(`${index + 1}. ${log.content}`);
  });
  
  if (result.length === 1 && result[0].content === 'Hello 3') {
    console.log("✅ Debounce test PASSED");
  } else {
    console.log("❌ Debounce test FAILED");
  }
  
} catch (error) {
  console.error("Error running debounce test:", error);
}