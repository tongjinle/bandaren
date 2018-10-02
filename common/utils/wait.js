let wait = function(check, callback, delay = 500) {
  let realDelay = 0;
  let t;
  let loop = () => {
    t = setTimeout(() => {
      if (check()) {
        callback();
      } else {
        realDelay = delay;
        clearTimeout(t);
        loop();
      }
    }, realDelay);
  };
  loop();
};

export default wait;
