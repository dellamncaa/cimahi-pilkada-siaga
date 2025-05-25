"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Topbar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageName, setPageName] = useState("Dashboard");
  const pathname = usePathname();

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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  const formatEmail = (email) => {
    return email ? email.split("@")[0] : "";
  };

  const pageNames = {
    "/superadmin": "Dashboard Utama",
    "/superadmin/logistik-superadmin": "Data Logistik",
    "/superadmin/monitoring-superadmin": "Pemantauan Lapangan",
    "/superadmin/voting-superadmin": "Data Hasil Suara",
    "/superadmin/map-superadmin": "Heatmap",
  };

  useEffect(() => {
    setPageName(pageNames[pathname] || "Dashboard");
  }, [pathname]);

  const toggleSidebar = () => {
    if (typeof setIsOpen === 'function') {
      setIsOpen(!isOpen);
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 h-16 bg-white shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse lg:hidden"></div>
            <div className="w-32 bg-gray-200 rounded h-4 animate-pulse"></div>
          </div>
          <div className="w-24 bg-gray-200 rounded h-8 animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-gray-800 truncate">
            {pageName}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center">
            <span className="text-sm text-gray-600 font-medium">
              {formatEmail(user?.email)}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md 
              text-white bg-red-600 hover:bg-red-700 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span className="hidden sm:inline ml-2">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
