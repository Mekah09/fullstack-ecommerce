const memory = new Map();

export function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return memory.get(key) ?? fallback;
  }
}

export function writeStored(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage-restricted browsers retain state for this tab. */
  }
}
