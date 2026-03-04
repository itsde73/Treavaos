import { cn } from "./utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "idle";
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full",
        {
          "bg-green-500 animate-pulse": status === "online",
          "bg-gray-400": status === "offline",
          "bg-yellow-500": status === "idle",
        },
        className
      )}
    />
  );
}
