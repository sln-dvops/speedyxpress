"use client"

import styles from "./FormProgress.module.css"

interface FormProgressProps {
  steps: string[]
  currentStep: number
}

export function FormProgress({ steps, currentStep }: FormProgressProps) {
  return (
    <div className={styles.wrapper}>
      {steps.map((step, index) => {
        const status =
          index < currentStep
            ? styles.completed
            : index === currentStep
            ? styles.active
            : styles.upcoming

        return (
          <div key={step} className={`${styles.step} ${status}`}>
            <div className={styles.circle}>{index + 1}</div>
            <span className={styles.label}>{step}</span>
            {index < steps.length - 1 && (
              <div className={styles.line} />
            )}
          </div>
        )
      })}
    </div>
  )
}
