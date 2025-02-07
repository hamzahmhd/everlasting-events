"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (user?.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (user === null || user.role !== "admin") return null; // Show nothing until the user state is resolved

  return <>{children}</>;
}

