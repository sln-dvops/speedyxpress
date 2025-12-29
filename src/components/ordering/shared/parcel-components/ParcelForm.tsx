"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ParcelDimensions } from "@/types/pricing";
import { getPricingTier, calculateVolumetricWeight } from "@/types/pricing";

interface ParcelFormProps {
  currentParcel: ParcelDimensions;
  handleDimensionChange: (field: keyof ParcelDimensions, value: string) => void;
  handleAddParcel: () => void;
  isValidDimensions: (dimensions: ParcelDimensions) => boolean;
  editingIndex: number | null;
  volumetricWeight: number
  effectiveWeight: number
}

export function ParcelForm({
  currentParcel,
  handleDimensionChange,
  handleAddParcel,
  isValidDimensions,
  editingIndex,
}: ParcelFormProps) {
  // Use the functions from pricing.ts for calculations
  const showWeightInfo =
    currentParcel.weight > 0 &&
    currentParcel.length > 0 &&
    currentParcel.width > 0 &&
    currentParcel.height > 0;

  // Only calculate if all values are present
  let tierInfo = null;
  let volumetricWeight = 0;

  if (showWeightInfo) {
    volumetricWeight = calculateVolumetricWeight(
      currentParcel.length,
      currentParcel.width,
      currentParcel.height
    );

    tierInfo = getPricingTier(currentParcel);
  }
  const exceedsLimit =
    currentParcel.weight > 30 ||
    currentParcel.length > 150 ||
    currentParcel.width > 150 ||
    currentParcel.height > 150;

  return (
    <div className="parcel-form">
      <div className="parcel-left">
        <div>
          <Label htmlFor="weight" className="parcel-label">
            *Weight (kg)
          </Label>

          <Input
            id="weight"
            type="number"
            value={currentParcel.weight || ""}
            onChange={(e) => handleDimensionChange("weight", e.target.value)}
            className="parcel-input"
            min="0"
            max="30"
            step="0.1"
          />
        </div>
        <p className="text-sm text-gray-500">Maximum weight: 30kg</p>

        <div className="parcel-dimension-grid">
          <div>
            <Label
              htmlFor="length"
              className="text-base flex items-center text-black"
            >
              *Length
            </Label>
            <Input
              id="length"
              type="number"
              value={currentParcel.length || ""}
              onChange={(e) => handleDimensionChange("length", e.target.value)}
              className="border-black"
              min="0"
              max="150"
              step="0.1"
            />
          </div>
          <div>
            <Label
              htmlFor="width"
              className="text-base flex items-center text-black"
            >
              Width
            </Label>
            <Input
              id="width"
              type="number"
              value={currentParcel.width || ""}
              onChange={(e) => handleDimensionChange("width", e.target.value)}
              className="border-black"
              min="0"
              max="150"
              step="0.1"
            />
          </div>
          <div>
            <Label
              htmlFor="height"
              className="text-base flex items-center text-black"
            >
              Height
            </Label>
            <Input
              id="height"
              type="number"
              value={currentParcel.height || ""}
              onChange={(e) => handleDimensionChange("height", e.target.value)}
              className="border-black"
              min="0"
              max="150"
              step="0.1"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          All dimensions in centimeters (cm). Maximum: 150cm per side
        </p>

        <Button
          onClick={handleAddParcel}
          className="parcel-button"
          disabled={!isValidDimensions(currentParcel)}
        >
          {editingIndex !== null ? "Update Parcel" : "Add Parcel"}
        </Button>
        <div className="infoBox">
  <p className="infoText">
    Volumetric Weight is calculated by multiplying length, width, height and dividing the total by 5000.
  </p>
</div>
      </div>
      

      <div className="parcel-right">
        <div className="relative mb-4">
          <Image
            src="/images/Package_cartoon.png"
            alt="Parcel dimensions illustration"
            width={300}
            height={300}
            className="parcel-image"
            priority
          />
        </div>

        {showWeightInfo && exceedsLimit && (
          <div className="parcel-error">
            Parcel values exceed the allowed limits.
            <br />
            Max weight: 30kg. Max dimension: 150cm per side.
          </div>
        )}

        {showWeightInfo && !exceedsLimit && tierInfo && (
          <div className="parcel-info">
            <p>
              <strong>Actual Weight:</strong> {currentParcel.weight.toFixed(2)}{" "}
              kg
            </p>
            <p>
              <strong>Volumetric Weight:</strong> {volumetricWeight.toFixed(2)}{" "}
              kg
            </p>

            <div className="parcel-info-divider">
              <p>
                <strong>Pricing Tier:</strong> {tierInfo.tier.name} ($
                {tierInfo.tier.price.toFixed(2)})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
