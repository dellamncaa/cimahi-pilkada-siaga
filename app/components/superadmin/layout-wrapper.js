"use client";
import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function LayoutWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Topbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
