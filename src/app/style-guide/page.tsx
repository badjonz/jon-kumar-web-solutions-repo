"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function StyleGuidePage() {
  return (
    <div className="container mx-auto p-8">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        Style Guide
      </motion.h1>

      {/* Animations Section */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-2xl font-semibold mb-4">Animations</h2>
        <p className="mb-4">Reusable animations for consistent UX across the application.</p>
        <Card>
          <CardHeader>
            <CardTitle>Fade Up</CardTitle>
            <CardDescription>A standard entrance animation for elements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-24 bg-secondary rounded-md">
                <motion.div
                    key={Date.now()} // Force re-render to replay animation
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg"
                >
                    I fade up!
                </motion.div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Usage:</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2 text-sm overflow-auto">
                <code>
{`import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeUp}
>
  ...
</motion.div>`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Buttons Section */}
      <motion.section className="mt-12" initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
          <Link href="#" className={cn(buttonVariants({ variant: "outline" }))}>
            Link as Button
          </Link>
        </div>
      </motion.section>

      {/* Cards Section */}
      <motion.section className="mt-12" initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is the card description.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content area of the card. It can contain any elements you need.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
              <Button variant="ghost" className="ml-2">Dismiss</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col">
             <CardHeader>
              <CardTitle>Another Card</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>This card has a bit more content to show how it expands.</p>
              <p className="mt-4">The footer in this example is pushed to the bottom because of the `flex-col` and `flex-grow` classes on the card and content respectively.</p>
            </CardContent>
            <CardFooter>
              <p>Footer with no buttons.</p>
            </CardFooter>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
