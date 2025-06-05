"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, resultDeclared } = useWallet();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isConnected) {
  //     router.push("/");
  //   }
  // }, [isConnected, router]);

  // useEffect(() => {
  //   if (resultDeclared) {
  //     router.push("/results");
  //   }
  // }, [resultDeclared, router]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          Please connect your wallet to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
