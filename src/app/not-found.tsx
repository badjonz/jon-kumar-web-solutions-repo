import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 text-center px-4">
      <p
        className="text-6xl font-bold text-orange-500 mb-4"
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Button
        asChild
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white min-h-[44px]"
      >
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
