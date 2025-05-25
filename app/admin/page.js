import React from "react";
import FormSelector from "@/app/components/admin/form-selector";

export default function AdminPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <FormSelector />
        </div>
      </div>
    </div>
  );
}
