export function truncateAddress(address: string) {
  return (
    address.slice(0, 9) +
    "..." +
    address.slice(address.length - 5, address.length)
  );
}
