let wait = function(check, callback, delay = 500) {
  let realDelay = 0;
  let loop = () => {
    setTimeout(() => {
      if (check()) {
        callback();
      } else {
        realDelay = delay;
        loop();
      }
    }, realDelay);
  };
  loop();
};

export default wait;
