export default function FormatDate(date) {
  const dateObject = new Date(date);

  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString('default', { month: 'long' }); // You can use 'short' or 'numeric' instead of 'long' for different formats

  const formattedDate = `${month} ${year}`;
  return formattedDate;
}
