export type ParcelSize = "2kg" | "5kg" | "10kg"
export type CollectionMethod = "dropoff" | "pickup"
export type DeliveryMethod = "standard" | "next-day-delivery"
// ParcelDimensions (future-safe)
export interface ParcelDimensions {
  weight: number
  length?: number
  width?: number
  height?: number
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
  postalSectors: number[]
  postalCodes?: string[]
  areas?: string[]
}

export const TIER_3_POSTAL_CODES: string[] = [
  "109680",
  "109681",
  "109682",
  "118326",
  "129817",
  "139302",
  "149373",
  "149501",
  "198834",
  "248843",
  "367833",
  "397970",
  "417902",
  "465556",
  "478937",
  "478969",
  "498760",
  "498761",
  "498802",
  "498819",
  "499611",
  "506969",
  "507087",
  "507093",
  "507709",
  "508487",
  "509863",
  "534257",
  "567754",
  "596302",
  "596472",
  "619532",
  "628398",
  "628439",
  "637559",
  "638357",
  "638361",
  "638364",
  "638501",
  "639937",
  "667988",
  "669638",
  "669642",
  "669644",
  "669645",
  "669646",
  "688248",
  "688253",
  "688255",
  "688256",
  "688257",
  "688793",
  "689953",
  "689954",
  "698956",
  "708972",
  "708976",
  "718919",
  "729753",
  "729754",
  "729756",
  "738103",
  "738203",
  "738406",
  "738700",
  "757618",
  "757621",
  "757752",
  "757753",
  "757758",
  "759945",
  "759956",
  "775900",
  "778895",
  "779914",
  "797792",
  "797809",
  "818948",
  "819116",
  "819117",
  "819118",
  "819658"
]

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
    name: "Tier 3",
    amount: 15,
    postalCodes: TIER_3_POSTAL_CODES,
    postalSectors: []
  }
]
export function getPostalSector(postalCode: string): number | null {
  if (!postalCode || postalCode.length < 2) return null
  const sector = Number(postalCode.slice(0, 2))
  return Number.isNaN(sector) ? null : sector
}

export function calculateLocationSurcharge(postalCode: string): number {
  if (!postalCode || postalCode.length !== 6) return 0

  // 1️⃣ Exact postal code match (Tier 3 first – most specific)
  for (const tier of LOCATION_SURCHARGES) {
    if (tier.postalCodes?.includes(postalCode)) {
      return tier.amount
    }
  }

  // 2️⃣ Fallback to sector-based logic
  const sector = getPostalSector(postalCode)
  if (sector === null) return 0

  for (const tier of LOCATION_SURCHARGES) {
    if (tier.postalSectors?.includes(sector)) {
      return tier.amount
    }
  }

  return 0
}


export const NEXT_DAY_FEE = 2.5
/**
 * SINGLE SOURCE OF TRUTH
 * Determines pricing tier based ONLY on actual weight
 */
export function getPricingTierByWeight(weight: number): PricingTier {
  let tier = PRICING_TIERS[PRICING_TIERS.length - 1]

  for (const t of PRICING_TIERS) {
    if (weight <= t.maxWeight) {
      tier = t
      break
    }
  }

  console.log(`Pricing calculation:
    - Actual weight: ${weight}kg
    - Tier applied: ${tier.name}
    - Base price: $${tier.price}
  `)

  return tier
}
export function calculateShippingPrice(
  dimensions: ParcelDimensions,
  deliveryMethod: DeliveryMethod
): number {
  const tier = getPricingTierByWeight(dimensions.weight)
  const handToHandFee = deliveryMethod === "next-day-delivery" ? NEXT_DAY_FEE : 0
  return tier.price + handToHandFee
}

export function calculateFullParcelPrice(
  parcel: ParcelDimensions,
  deliveryMethod: DeliveryMethod,
  postalCode?: string
): number {
  const base = calculateShippingPrice(parcel, deliveryMethod)
  const surcharge = postalCode
    ? calculateLocationSurcharge(postalCode)
    : 0

  return base + surcharge
}

/**
 * Determine the pricing tier name (T1, T2, T3, T4) based on parcel dimensions
 */
export function determinePricingTier(dimensions: ParcelDimensions): string {
  return getPricingTierByWeight(dimensions.weight).name
}
