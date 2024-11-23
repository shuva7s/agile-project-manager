"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MotionDivProps {
  children: React.ReactNode;
  className?: string;
  initial_opacity: number;
  initial_y: number;
  final_opacity: number;
  final_y: number;
  transition_delay: number;
  transition_duration: number;
  transition_type: "easeIn" | "easeOut" | "easeInOut" | "linear"; // Use "linear" instead of "Linear"
  once: boolean;
}

const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className,
  initial_opacity,
  initial_y,
  final_opacity,
  final_y,
  transition_delay,
  transition_duration,
  transition_type,
  once,
}) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: initial_opacity, y: initial_y }}
      whileInView={{ opacity: final_opacity, y: final_y }}
      transition={{
        delay: transition_delay,
        duration: transition_duration,
        ease: transition_type,
      }}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
};

export default MotionDiv;
