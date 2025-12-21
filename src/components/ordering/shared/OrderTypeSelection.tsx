"use client";

import { Package, PackageIcon as Packages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import styles from "./OrderTypeSelection.module.css";

type OrderType = "individual" | "bulk";

interface OrderTypeSelectionProps {
  onNextStep: (orderType: OrderType) => void;
}

export function OrderTypeSelection({ onNextStep }: OrderTypeSelectionProps) {
  return (
    <Card className={styles.container}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          What would you like to send?
        </CardTitle>
        <p className={styles.subtitle}>Select parcel type.</p>
      </CardHeader>

      <CardContent className={styles.content}>
        <div className={styles.grid}>
          <OrderTypeCard
            icon={
              <Image
                src="/icons/individual-order.png"
                alt="Individual order"
                width={60}
                height={60}
              />
            }
            title="Individual Order"
            description="Send a single parcel to once recipient. Perfect for sending gifts, documents, or small items."
            actionLabel="Select Individual"
            onClick={() => onNextStep("individual")}
          />

          <OrderTypeCard
            icon={
              <Image
                src="/icons/bulk-order.png"
                alt="Bulk order"
                width={60}
                height={60}
              />
            }
            title="Bulk Order"
            description="Send multiple parcels to different recipients. Ideal for businesses or sending to multiple family members."
            actionLabel="Select Bulk"
            onClick={() => onNextStep("bulk")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function OrderTypeCard({
  icon,
  title,
  description,
  actionLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>

      <Button className={styles.button}>{actionLabel}</Button>
    </div>
  );
}
