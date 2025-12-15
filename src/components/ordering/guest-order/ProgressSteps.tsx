"use client"

import { motion } from "framer-motion"

interface StepItem {
  label: string
}

interface ProgressStepsProps {
  currentStep: number
  steps: StepItem[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 -z-10" />

        {/* Animated progress line */}
        <motion.div
          className="absolute top-1/2 left-0 h-[3px] bg-black -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        {steps.map((step, i) => {
          const isActive = i === currentStep
          const isCompleted = i < currentStep

          return (
            <div className="flex flex-col items-center w-full" key={i}>
              <motion.div
                className={`w-7 h-7 rounded-full flex justify-center items-center text-sm font-bold 
                ${
                  isActive
                    ? "bg-black text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {i + 1}
              </motion.div>

              <div className="text-xs mt-2 text-gray-700">
                {step.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
