"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 text-center px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Please try again.
      </p>
      <Button
        onClick={reset}
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white min-h-[44px]"
      >
        Try Again
      </Button>
    </div>
  );
}
