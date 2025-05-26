
"use client";

import { useState, useEffect } from 'react';
import { Badge, badgeVariants } from "@/components/ui/badge"; // Ensure badgeVariants is exported if needed for type, or import type VariantProps
import type { VariantProps } from "class-variance-authority";

// Define the type for badge variants based on your badgeVariants export
// If badgeVariants is not exported, you might need to define this manually or adjust
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export function FarmerStatusBadge() {
  const [statusInfo, setStatusInfo] = useState<{ text: string; variant: BadgeVariant } | null>(null);

  useEffect(() => {
    // This runs only on the client, after initial hydration
    const isDefaultVariant = Math.random() > 0.5;
    const isActive = Math.random() > 0.5;
    
    let variantValue: BadgeVariant = "secondary";
    if (isDefaultVariant) {
        variantValue = "default";
    }

    setStatusInfo({
      text: isActive ? "Active" : "Inactive",
      variant: variantValue,
    });
  }, []); // Empty dependency array ensures this runs once on mount

  if (!statusInfo) {
    // Render a placeholder or nothing until client-side state is set.
    // This ensures server and initial client render match.
    // Using a Badge with a fixed variant and text for the loading state.
    return <Badge variant="outline">...</Badge>; 
  }

  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.text}
    </Badge>
  );
}
