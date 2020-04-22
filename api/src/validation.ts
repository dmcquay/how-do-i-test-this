export function isValidCreateOrderRequest(req: any) {
  if (req === undefined) return false;
  if (typeof req.amountCents !== "number") return false;
  if (Math.floor(req.amountCents) !== req.amountCents) return false;
  return true;
}
