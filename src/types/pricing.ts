export type ParcelSize = "2kg" | "5kg" | "10kg"
export type CollectionMethod = "dropoff" | "pickup"
export type DeliveryMethod = "atl" | "hand-to-hand"

export interface ParcelDimensions {
  weight: number // in kg
  length: number // in cm
  width: number // in cm
  height: number // in cm

  id?: string
  short_id?: string
  pricingTier?: string
}

export interface PricingTier {
  name: string // T1, T2, T3, T4
  maxWeight: number // in kg
  price: number // in SGD
}
export const PRICING_TIERS: PricingTier[] = [
  { name: "T1", maxWeight: 4, price: 4.5 },
  { name: "T2", maxWeight: 10, price: 5.8 },
  { name: "T3", maxWeight: 20, price: 10.3 },
  { name: "T4", maxWeight: 30, price: 17.4 },
]

export interface LocationSurcharge {
  name: string
  amount: number
  postalSectors?: number[]
  areas?: string[]
}
export const LOCATION_SURCHARGES: LocationSurcharge[] = [
  {
    name: "Tier 1",
    amount: 4,
    postalSectors: [1,2,3,4,5,6,7,8,22,23,63],
  },
  {
    name: "Tier 2",
    amount: 6,
    postalSectors: [9,69],
  },
  {
    name: "Restricted Area",
    amount: 15,
    areas: ["Military", "Airport", "Immigration", "SATs"],
  },
]
export function getPostalSector(postalCode: string): number | null {
  if (!postalCode || postalCode.length < 2) return null
  return parseInt(postalCode.substring(0, 2), 10)
}


const RESTRICTED_KEYWORDS = [
  "camp",
  "air base",
  "airbase",
  "air force",
  "rsa f",
  "rsaf",
  "military",
  "mindef",
  "saf",
  "immigration",
  "ica",
  "checkpoint",
  "sats",
  "cargo",
]
export function isRestrictedArea(
  street: string,
  unitNo?: string
): boolean {
  const combined = `${street} ${unitNo ?? ""}`.toLowerCase()

  return RESTRICTED_KEYWORDS.some(keyword =>
    combined.includes(keyword)
  )
}
export function calculateLocationSurcharge(
  postalCode: string,
  street?: string,
  unitNo?: string
): number {
  // 1️⃣ Restricted area override
  if (street && isRestrictedArea(street, unitNo)) {
    return 15
  }

  // 2️⃣ Normal postal-sector pricing
  const sector = getPostalSector(postalCode)
  if (sector === null) return 0

  for (const s of LOCATION_SURCHARGES) {
    if (s.postalSectors?.includes(sector)) {
      return s.amount
    }
  }

  return 0
}


export const HAND_TO_HAND_FEE = 2.5

/**
 * The divisor 5000 is an industry standard conversion factor used in logistics.
 * It converts dimensional weight from cm³ to kg using the formula:
 * Volumetric Weight (kg) = (Length × Width × Height) ÷ 5000
 *
 * This factor assumes an average density of 200 kg/m³:
 * - 1 m³ = 1,000,000 cm³
 * - 200 kg/m³ = 200 kg/1,000,000 cm³
 * - Therefore: 1 kg = 5000 cm³
 *
 * This is why we divide by 5000 to convert volume in cm³ to equivalent weight in kg.
 */
export function calculateVolumetricWeight(length: number, width: number, height: number): number {
  return (length * width * height) / 5000
}

/**
 * SINGLE SOURCE OF TRUTH for determining the pricing tier based on dimensions
 * Returns the pricing tier object that should be used for the given dimensions
 */
export function getPricingTier(dimensions: ParcelDimensions): {
  tier: PricingTier
  chargeableWeight: number
  volumetricWeight: number
} {
  const { weight, length, width, height } = dimensions

  const volumetricWeight = calculateVolumetricWeight(length, width, height)
  const chargeableWeight = Math.max(weight, volumetricWeight)

  let tier = PRICING_TIERS[PRICING_TIERS.length - 1]
  for (const t of PRICING_TIERS) {
    if (chargeableWeight <= t.maxWeight) {
      tier = t
      break
    }
  }

  console.log(`Pricing calculation:
    - Actual weight: ${weight}kg
    - Volumetric weight: ${volumetricWeight.toFixed(2)}kg
    - Chargeable weight: ${chargeableWeight.toFixed(2)}kg
    - Tier applied: ${tier.name}
    - Base price: $${tier.price}
  `)

  return {
    tier,
    chargeableWeight,
    volumetricWeight,
  }
}

/**
 * Calculate the shipping price based on dimensions and delivery method
 */
export function calculateShippingPrice(
  dimensions: ParcelDimensions,
  deliveryMethod: DeliveryMethod
): number {
  const { tier } = getPricingTier(dimensions)
  const handToHandFee = deliveryMethod === "hand-to-hand" ? HAND_TO_HAND_FEE : 0
  return tier.price + handToHandFee
}


/**
 * Determine the pricing tier name (T1, T2, T3, T4) based on parcel dimensions
 */
export function determinePricingTier(dimensions: ParcelDimensions): string {
  // Get the pricing tier using our single source of truth
  const { tier } = getPricingTier(dimensions)
  return tier.name
}

/**
 * Helper function to convert volumetric measurements to kg/cm³
 * This is useful for debugging and verification against the pricing table
 */
export function calculateVolumetricDensity(length: number, width: number, height: number, weight: number): number {
  const volume = length * width * height // in cm³
  return weight / volume // gives kg/cm³
}
