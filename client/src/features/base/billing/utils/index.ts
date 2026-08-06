export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount); // Removed Math.abs here so negative numbers remain negative
}


export function formatDate(dateStr: string) {
 return new Date(dateStr).toLocaleDateString("en-US", {
   year: "numeric",
   month: "long",
   day: "numeric",
 });
}

export function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}