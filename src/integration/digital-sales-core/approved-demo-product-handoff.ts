export function approvedDemoProductHandoffUrl(
  destinationValue: string,
  productId: string,
  baseUrl: string,
  currentOrigin: string,
): string | null {
  if (!destinationValue.trim() || !productId.trim()) return null;

  try {
    const current = new URL(currentOrigin);
    const destination = new URL(destinationValue);
    const base = new URL(baseUrl, current);
    const expectedPath = new URL(`products/${encodeURIComponent(productId)}`, base).pathname;

    if (
      current.protocol !== "https:" ||
      destination.protocol !== "https:" ||
      destination.origin !== current.origin ||
      destination.pathname !== expectedPath ||
      destination.username ||
      destination.password ||
      destination.hash
    ) return null;

    return destination.href;
  } catch {
    return null;
  }
}
