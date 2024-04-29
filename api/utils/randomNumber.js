export function generateRandomNumber(length) {
  const num = Math.random();
  return num.toString().slice(2, length + 2);
}
