"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import styles from "./ParcelDimensions.module.css";

import { CsvUploader } from "@/components/ordering/bulk-order/CsvUploader";
import { ParcelForm } from "@/components/ordering/shared/parcel-components/ParcelForm";
import { ParcelList } from "@/components/ordering/shared/parcel-components/ParcelList";
import { ParcelSummary } from "@/components/ordering/shared/parcel-components/ParcelSummary";

import type { ParcelDimensions } from "@/types/pricing";
import type { RecipientDetails } from "@/types/order";

type ParcelDimensionsProps = {
  onPrevStep: () => void;
  onNextStep: () => void;
  selectedDimensions: ParcelDimensions[] | null;
  setSelectedDimensions: (dimensions: ParcelDimensions[]) => void;
  setRecipients: React.Dispatch<React.SetStateAction<RecipientDetails[]>>;
};

export function ParcelDimensions({
  onPrevStep,
  onNextStep,
  selectedDimensions,
  setSelectedDimensions,
  setRecipients,
}: ParcelDimensionsProps) {
  const [inputMethod, setInputMethod] = useState<"csv" | "manual" | null>(null);

  const [currentParcel, setCurrentParcel] = useState<ParcelDimensions>({
    weight: 0,
  });

  const [parcels, setParcels] = useState<ParcelDimensions[]>(
    () => selectedDimensions ?? [],
  );

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleDimensionChange = (
    field: keyof ParcelDimensions,
    value: string,
  ) => {
    const numValue = Number.parseFloat(value) || 0;
    setCurrentParcel((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const isValidParcel = (parcel: ParcelDimensions) =>
    parcel.weight > 0 && parcel.weight <= 30;

  const handleAddParcel = () => {
    if (!isValidParcel(currentParcel)) return;

    if (editingIndex !== null) {
      const updated = [...parcels];
      updated[editingIndex] = currentParcel;
      setParcels(updated);
      setEditingIndex(null);
    } else {
      setParcels([...parcels, currentParcel]);
    }

    setCurrentParcel({ weight: 0 });
  };

  const handleEditParcel = (index: number) => {
    setCurrentParcel(parcels[index]);
    setEditingIndex(index);
  };

  const handleRemoveParcel = (index: number) => {
    setParcels(parcels.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const calculateTotalWeight = () =>
    parcels.reduce((sum, p) => sum + p.weight, 0);

  const handleContinue = () => {
    if (parcels.length >= 2) {
      setSelectedDimensions(parcels);
      onNextStep();
    }
  };

  const handleSetRecipients = useCallback(
    (newRecipients: RecipientDetails[]) => {
      setRecipients(newRecipients);
    },
    [setRecipients],
  );

  const handleSetParcelsFromCsv = (newParcels: ParcelDimensions[]) => {
    setInputMethod("csv");
    setParcels(newParcels);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-0 md:flex md:justify-center">
      <div className="w-full md:max-w-[1000px]">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black">
              Multiple Parcels Details
            </CardTitle>

            <Badge className="bg-yellow-200 text-black border-black mt-2 mb-4">
              Multiple Parcels
            </Badge>

            {parcels.length > 0 && (
              <Badge className="bg-yellow-200 text-black border-black mb-4">
                {parcels.length} {parcels.length === 1 ? "Parcel" : "Parcels"}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ===== METHOD SELECTION ===== */}
            {!inputMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 md:grid-cols-2"
              >
                {/* CSV */}
                <div
                  onClick={() => setInputMethod("csv")}
                  className="cursor-pointer rounded-2xl border border-gray-300 bg-white p-6 hover:shadow-xl transition-all hover:border-yellow-400 "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-black" />
                    <h3 className="text-base sm:text-xl font-semibold">
                      Upload CSV
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Upload a CSV file to add multiple parcels at once.
                  </p>

                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                    Select CSV Upload
                  </Button>
                </div>

                {/* MANUAL */}
                <div
                  onClick={() => setInputMethod("manual")}
                  className="cursor-pointer rounded-2xl border border-gray-300 bg-white p-6 hover:shadow-xl transition-all hover:border-yellow-400 "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Pencil className="h-6 w-6 text-black" />
                    <h3 className="text-base sm:text-xl font-semibold">
                      Manual Upload
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Add parcels one by one manually.
                  </p>

                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                    Select Manual Entry
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ===== SWITCHING CONTENT ===== */}
            <AnimatePresence mode="wait">
              {/* CSV MODE */}
              {inputMethod === "csv" && (
                <motion.div
                  key="csv"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-gray-600">
                      Upload your CSV file
                    </p>

                    <Button
                      variant="outline"
                      onClick={() => setInputMethod("manual")}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
                    >
                      <Pencil className="h-6 w-6 text-black" />
                      <span className="text-xs sm:text-sm">
                        Switch to Manual
                      </span>
                    </Button>
                  </div>

                  <CsvUploader
                    setParcels={handleSetParcelsFromCsv}
                    setRecipients={handleSetRecipients}
                  />
                </motion.div>
              )}

              {/* MANUAL MODE */}
              {inputMethod === "manual" && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-gray-600">
                      Add parcels manually
                    </p>

                    <Button
                      variant="outline"
                      onClick={() => setInputMethod("csv")}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
                    >
                      <FileText className="h-6 w-6 text-black" />
                      <span className="text-xs sm:text-sm">Switch to CSV</span>
                    </Button>
                  </div>

                  <ParcelForm
                    currentParcel={currentParcel}
                    handleDimensionChange={handleDimensionChange}
                    handleAddParcel={handleAddParcel}
                    editingIndex={editingIndex}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== RESULTS ===== */}
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

          <CardFooter className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={onPrevStep}
              className="w-full sm:w-auto"
            >
              Back
            </Button>

            <Button
              onClick={handleContinue}
              className="w-full sm:w-auto bg-black text-yellow-400"
              disabled={parcels.length < 2}
            >
              Continue
            </Button>
          </CardFooter>

          {parcels.length < 2 && (
            <p className="text-sm text-red-500 text-center mt-2">
              Please add at least 2 parcels for a bulk order.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
