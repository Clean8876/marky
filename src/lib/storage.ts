const STORAGE_KEYS = {
  theme: "marky-theme",
  mode: "marky-mode",
} as const

export type AppMode = "empty" | "viewer" | "editor"

export function readStoredMode(): "viewer" | "editor" {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.mode)
    return value === "editor" ? "editor" : "viewer"
  } catch {
    return "viewer"
  }
}

export function persistMode(mode: "viewer" | "editor") {
  try {
    localStorage.setItem(STORAGE_KEYS.mode, mode)
  } catch {
    /* ignore quota / private mode */
  }
}

export function documentPath() {
  return readStoredMode() === "editor" ? "/edit" : "/"
}

export { STORAGE_KEYS }
