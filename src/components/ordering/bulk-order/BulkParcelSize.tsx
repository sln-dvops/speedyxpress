"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { CsvUploader } from "@/components/ordering/bulk-order/CsvUploader"
import { ParcelForm } from "@/components/ordering/shared/parcel-components/ParcelForm"
import { ParcelList } from "@/components/ordering/shared/parcel-components/ParcelList"
import { ParcelSummary } from "@/components/ordering/shared/parcel-components/ParcelSummary"

import type { ParcelDimensions } from "@/types/pricing"
import type { RecipientDetails } from "@/types/order"

type ParcelDimensionsProps = {
  onPrevStep: () => void
  onNextStep: () => void
  selectedDimensions: ParcelDimensions[] | null
  setSelectedDimensions: (dimensions: ParcelDimensions[]) => void
  setRecipients: React.Dispatch<React.SetStateAction<RecipientDetails[]>>
}

export function ParcelDimensions({
  onPrevStep,
  onNextStep,
  selectedDimensions,
  setSelectedDimensions,
  setRecipients,
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

    if (editingIndex !== null) {
      const updated = [...parcels]
      updated[editingIndex] = currentParcel
      setParcels(updated)
      setEditingIndex(null)
    } else {
      setParcels([...parcels, currentParcel])
    }

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

  const handleRemoveParcel = (index: number) => {
    setParcels(parcels.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  const calculateTotalWeight = () =>
    parcels.reduce((sum, parcel) => sum + parcel.weight, 0)

  const handleContinue = () => {
    if (parcels.length > 0) {
      setSelectedDimensions(parcels)
      onNextStep()
    }
  }

  const handleSetRecipients = useCallback(
    (newRecipients: RecipientDetails[]) => {
      setRecipients(newRecipients)
    },
    [setRecipients]
  )

  const handleSetParcelsFromCsv = (newParcels: ParcelDimensions[]) => {
    setParcels(newParcels)
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-black">
          Multiple Parcels Details
        </CardTitle>

        <Badge variant="outline" className="bg-yellow-200 text-black border-black mt-2">
          Multiple Parcels
        </Badge>

        {parcels.length > 0 && (
          <Badge variant="outline" className="bg-yellow-100 text-black border-black mt-2">
            {parcels.length} {parcels.length === 1 ? "Parcel" : "Parcels"}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Add multiple parcels by uploading the CSV files.
          </p>
        </div>

        <CsvUploader
          setParcels={handleSetParcelsFromCsv}
          setRecipients={handleSetRecipients}
          isValidDimensions={isValidDimensions}
        />

        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Add multiple parcels manually.
          </p>
        </div>
        <ParcelForm
          currentParcel={currentParcel}
          handleDimensionChange={handleDimensionChange}
          handleAddParcel={handleAddParcel}
          isValidDimensions={isValidDimensions}
          editingIndex={editingIndex}
          volumetricWeight={volumetricWeight}
          effectiveWeight={effectiveWeight}
        />

        {parcels.length > 0 && (
          <ParcelList
            parcels={parcels}
            handleEditParcel={handleEditParcel}
            handleRemoveParcel={handleRemoveParcel}
          />
        )}

        {parcels.length > 0 && (
          <ParcelSummary
            parcels={parcels}
            calculateTotalWeight={calculateTotalWeight}
          />
        )}
      </CardContent>

      <CardFooter className="px-6 py-4 flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-black text-yellow-400"
          disabled={parcels.length < 2}
        >
          Continue
        </Button>
      </CardFooter>

      {parcels.length < 2 && (
        <p className="text-sm text-red-500 text-center mt-2">
          Please add at least 2 parcels for this order.
        </p>
      )}
    </Card>
  )
}
