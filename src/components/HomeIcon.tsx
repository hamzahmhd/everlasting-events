"use client";

import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

interface HomeIconProps {
  className?: string;
}

export default function HomeIcon({ className }: HomeIconProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className={`absolute top-4 left-4 text-teal-500 hover:text-teal-700 transition ${className}`}
      aria-label="Go to homepage"
    >
      <FaHome size={24} />
    </button>
  );
}

