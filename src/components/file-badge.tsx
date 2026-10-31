import { FileStatus } from "@/lib/store/compresso-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Variant = "gray" | "orange" | "green" | "red" | "selection";

export const FileBadge = ({
  children,
  variant = "gray", // Default variant is gray
  progress = undefined,
  
}: {
  children: React.ReactNode;
  variant?: Variant;
  progress?: number;
  error?: string;
}) => {
  // Define the base styles and variant-specific styles

  const variantStyles: Record<Variant, string> = {
    gray: `bg-gray-100 border px-2 py-1 rounded-lg border-gray-300 text-gray-800
    dark:bg-gray-800/20 dark:border-gray-700/20 dark:text-gray-400
    `,
    orange: `bg-yellow-100 border px-2 py-1 rounded-lg border-yellow-300 text-yellow-800 
      dark:bg-yellow-800/20 dark:border-yellow-700/20 dark:text-yellow-600
      `,
    green: `bg-lime-100 border px-2 py-1 rounded-lg border-lime-300 text-lime-800 
      dark:bg-lime-800/20 dark:border-lime-700/20 dark:text-lime-400
      `,
    red: `bg-red-100 border px-2 py-1 rounded-lg border-red-300 text-red-800 
      dark:bg-red-800/20 dark:border-red-700/20 dark:text-red-400
      `,
    selection: `bg-purple-100 border px-2 py-1 rounded-lg text-purple-500 border-transparent 
      dark:bg-purple-800/20 dark:border-purple-700/20 dark:text-purple-400
      `,
  };

  return (
    <div
      className={cn(
        "border px-2 py-1 relative overflow-hidden",
        variantStyles[variant]
      )}
    >
      {progress !== undefined && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: progress / 100 }}
          //   transition={{ duration: 0.1, ease: "easeInOut" }}
          className="absolute left-0 top-0 bottom-0 w-full origin-left bg-current opacity-10"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
};

export const getVariant = (status: FileStatus): Variant => {
  switch (status) {
    case "ready":
      return "gray";
    case "error":
      return "red";
    case "waiting":
      return "orange";
    case "compressing":
      return "selection";
    case "done":
      return "green";
    default:
      return "gray";
  }
};
