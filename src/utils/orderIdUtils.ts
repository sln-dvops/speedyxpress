const SPD_TRACKING_REGEX = /^SPD[0-9]{10}$/
export function isShortId(id: string): boolean {
  return SPD_TRACKING_REGEX.test(id)
}

/**
 * Generates a SPD tracking ID
 * Format: SPD + 10 numeric digits
 * Example: SPD9312748592
 */
export function generateTrackingId(): string {
  const prefix = "SPD"
  let digits = ""

  for (let i = 0; i < 10; i++) {
    digits += Math.floor(Math.random() * 10).toString()
  }

  return prefix + digits
}

/**
 * Checks if the provided ID is a valid UUID with hyphens
 */
export function isFullUuid(id: string): boolean {
  const uuidRegexWithHyphens = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegexWithHyphens.test(id)
}

/**
 * Checks if the provided ID is a valid UUID without hyphens (32 hexadecimal characters)
 */
export function isUuidWithoutHyphens(id: string): boolean {
  const uuidRegexWithoutHyphens = /^[0-9a-f]{32}$/i
  return uuidRegexWithoutHyphens.test(id)
}

/**
 * Formats a UUID without hyphens to include hyphens
 */
export function formatUuidWithHyphens(id: string): string {
  if (isUuidWithoutHyphens(id)) {
    return [id.slice(0, 8), id.slice(8, 12), id.slice(12, 16), id.slice(16, 20), id.slice(20)].join("-")
  }
  return id
}
/**
 * Extracts the random part of a SPD tracking ID (last 6 chars)
 */
export function extractShortId(id: string): string {
  if (isShortId(id)) {
    return id.slice(4)
  }
  return id
}

export function validateOrderId(id: string): string | null {
  const cleanedId = id.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "")

  // New SPD tracking ID
  if (isShortId(cleanedId)) {
    return cleanedId
  }

  // Legacy UUID (no hyphens)
  if (isUuidWithoutHyphens(cleanedId)) {
    return formatUuidWithHyphens(cleanedId)
  }

  // Legacy UUID (with hyphens)
  if (isFullUuid(cleanedId)) {
    return cleanedId
  }

  return null
}
