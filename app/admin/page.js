"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import FormSelector from "@/app/components/admin/form-selector";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/auth/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <FormSelector user={user} />
        </div>
      </div>
    </div>
  );
}