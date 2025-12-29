"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import styles from "./ParcelDimensions.module.css"

import { ParcelForm } from "@/components/ordering/shared/parcel-components/ParcelForm"
import { ParcelList } from "@/components/ordering/shared/parcel-components/ParcelList"
import { ParcelSummary } from "@/components/ordering/shared/parcel-components/ParcelSummary"

import type { ParcelDimensions } from "@/types/pricing"

type ParcelDimensionsProps = {
  onPrevStep: () => void
  onNextStep: () => void
  selectedDimensions: ParcelDimensions[] | null
  setSelectedDimensions: (dimensions: ParcelDimensions[]) => void
}

export function ParcelDimensions({
  onPrevStep,
  onNextStep,
  selectedDimensions,
  setSelectedDimensions,
}: ParcelDimensionsProps) {
  const [currentParcel, setCurrentParcel] = useState<ParcelDimensions>({
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
  })

  const [parcels, setParcels] = useState<ParcelDimensions[]>(
    () => selectedDimensions ?? []
  )

  const [volumetricWeight, setVolumetricWeight] = useState(0)
  const [effectiveWeight, setEffectiveWeight] = useState(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // --- Derived weight calculations (UI only) ---
  useEffect(() => {
    const vw =
      (currentParcel.length * currentParcel.width * currentParcel.height) / 5000

    setVolumetricWeight(vw)
    setEffectiveWeight(Math.max(currentParcel.weight, vw))
  }, [currentParcel])

  const handleDimensionChange = (
    field: keyof ParcelDimensions,
    value: string
  ) => {
    const numValue = Number.parseFloat(value) || 0
    setCurrentParcel((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const isValidDimensions = (dimensions: ParcelDimensions) => {
    return (
      dimensions.weight > 0 &&
      dimensions.weight <= 30 &&
      dimensions.length > 0 &&
      dimensions.length <= 150 &&
      dimensions.width > 0 &&
      dimensions.width <= 150 &&
      dimensions.height > 0 &&
      dimensions.height <= 150
    )
  }

  const handleAddParcel = () => {
    if (!isValidDimensions(currentParcel)) return

    // Single package → always exactly one parcel
    setParcels([currentParcel])
    setEditingIndex(null)

    setCurrentParcel({
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    })
  }

  const handleEditParcel = (index: number) => {
    setCurrentParcel(parcels[index])
    setEditingIndex(index)
  }

  const handleRemoveParcel = () => {
    setParcels([])
    setEditingIndex(null)
    setCurrentParcel({
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    })
  }

  const calculateTotalWeight = () =>
    parcels.reduce((total, parcel) => total + parcel.weight, 0)

  const handleContinue = () => {
    if (parcels.length === 1) {
      setSelectedDimensions(parcels)
      onNextStep()
    }
  }

  return (
    <Card className={styles.container}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          Single Package Details
        </CardTitle>

        <div className={styles.badges}>
          <Badge className={styles.orderTypeBadge}>
            Single Package
          </Badge>

          {parcels.length === 1 && (
            <Badge className={styles.statusBadge}>
              Parcel Added
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>
            Single Package Information
          </h3>
          <p className={styles.infoText}>
            Please provide the dimensions and weight of your parcel.
            Only one parcel is allowed for this order.
          </p>
        </div>

        {(parcels.length === 0 || editingIndex !== null) && (
          <ParcelForm
            currentParcel={currentParcel}
            handleDimensionChange={handleDimensionChange}
            handleAddParcel={handleAddParcel}
            isValidDimensions={isValidDimensions}
            editingIndex={editingIndex}
            volumetricWeight={volumetricWeight}
            effectiveWeight={effectiveWeight}
          />
        )}

        {parcels.length === 1 && (
          <ParcelList
            parcels={parcels}
            handleEditParcel={handleEditParcel}
            handleRemoveParcel={handleRemoveParcel}
          />
        )}

        {parcels.length === 1 && (
          <ParcelSummary
            parcels={parcels}
            calculateTotalWeight={calculateTotalWeight}
          />
        )}
      </CardContent>

      <CardFooter className={styles.footer}>
        <Button
          variant="outline"
          onClick={onPrevStep}
          className={styles.backButton}
        >
          Back
        </Button>

        <Button
          onClick={handleContinue}
          className={styles.nextButton}
          disabled={parcels.length !== 1}
        >
          Continue to Delivery Method
        </Button>
      </CardFooter>
    </Card>
  )
}
