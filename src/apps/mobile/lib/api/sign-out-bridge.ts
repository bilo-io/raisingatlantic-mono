type SignOutHandler = () => void | Promise<void>;

let currentHandler: SignOutHandler | null = null;
let inFlight = false;

export function setSignOutHandler(fn: SignOutHandler | null): void {
  currentHandler = fn;
}

export async function triggerSignOut(): Promise<void> {
  if (!currentHandler || inFlight) return;
  inFlight = true;
  try {
    await currentHandler();
  } finally {
    inFlight = false;
  }
}
