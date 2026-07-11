import type { VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button-variants";

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDragExit"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

type ButtonProps = NativeButtonProps & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
