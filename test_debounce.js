// Test script to reproduce the debounce issue
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

// Test if setTimeout works at all
console.log('Before setTimeout');
setTimeout(() => {
  console.log('setTimeout executed');
}, 50);
console.log('After setTimeout');