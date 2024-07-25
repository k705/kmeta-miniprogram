
export function throttle(fn, time) {
  let startTime = 0;
  return function () {
    const endTime = Date.now();
    if (endTime - startTime > time) {
      fn.apply(this, arguments);
      startTime = endTime;
    }
  };
}

export function debounce(fn, time) {
  let timeId = 0;
  return function () {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      fn.apply(this, arguments);
    }, time)
  };
}

export function formatDate(time) {
  const date = new Date(time);
  const y = date.getFullYear();
  // 月份和日期需要补0：小于10要补0
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return `${y}-${m}-${d}`
}