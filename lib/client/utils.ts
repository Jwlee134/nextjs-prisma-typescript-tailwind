export function cls(...arg: string[]) {
  return arg.join(" ");
}
export function formatCreatedAt(createdAt: Date) {
  const milliSeconds = Date.now() - new Date(createdAt).getTime();
  const seconds = milliSeconds / 1000;
  if (seconds < 60) return `${Math.floor(seconds)}초 전`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;
  const weeks = days / 7;
  if (weeks < 5) return `${Math.floor(weeks)}주 전`;
  const months = days / 30;
  if (months < 12) return `${Math.floor(months)}달 전`;
  const years = days / 365;
  return `${Math.floor(years)}년 전`;
}

export function deepCopy(data: any): any {
  if (Array.isArray(data)) {
    const arr = [];
    for (const item of data) {
      if (typeof item === "object") {
        arr.push(deepCopy(item));
      } else {
        arr.push(item);
      }
    }
    return arr;
  }
  const obj: { [key: string]: any } = {};
  for (const key in data) {
    if (Array.isArray(data[key])) {
      obj[key] = deepCopy(data[key]);
    } else {
      obj[key] = data[key];
    }
  }
  return obj;
}
