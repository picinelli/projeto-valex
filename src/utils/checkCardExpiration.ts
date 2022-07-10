export default function isCardExpired(date: string) {
  const month = parseInt(date.split("/")[0]);
  const year = parseInt(date.split("/")[1]) + 2000;
  const expirationDate = new Date(year, month);
  const now = new Date();

  if (now >= expirationDate) return true;
  return false;
}