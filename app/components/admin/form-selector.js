"use client";
import { useState } from "react";
import FormVoting from "./form-voting";
import FormMonitoring from "./form-monitoring";
import FormLogistik from "./form-logistik";

export default function FormSelector() {
  const [activeForm, setActiveForm] = useState(null);

  const handleReturn = () => {
    setActiveForm(null);
  };

  if (activeForm) {
    return (
      <div>
        {activeForm === "FormVoting" && (
          <div>
            <FormVoting handleReturn={handleReturn} />
          </div>
        )}
        {activeForm === "FormMonitoring" && (
          <div>
            <FormMonitoring handleReturn={handleReturn} />
          </div>
        )}
        {activeForm === "FormLogistik" && (
          <FormLogistik handleReturn={handleReturn} />
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Pilih Formulir Input Data
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveForm("FormLogistik")}
            className="rounded-lg p-4 cursor-pointer bg-gradient-to-r bg-gray-200 hover:from-blue-800 hover:to-indigo-900 hover:bg-blue-500 group hover:cursor-pointer"
          >
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-white">Formulir Input Logistik</h3>
            <p className="mt-1 text-sm text-gray-600 group-hover:text-white">Formulir untuk mencatat kondisi distribusi logistik</p>
          </button>

          <button
            onClick={() => setActiveForm("FormMonitoring")}
            className="rounded-lg p-4 cursor-pointer bg-gradient-to-r bg-gray-200 hover:from-blue-800 hover:to-indigo-900 hover:bg-blue-500 group hover:cursor-pointer"
          >
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-white">Formulir Input Pantauan Lapangan</h3>
            <p className="mt-1 text-sm text-gray-600 group-hover:text-white">Formulir input data kejadian bencana pada TPS</p>
          </button>

          <button
            onClick={() => setActiveForm("FormVoting")}
            className="rounded-lg p-4 cursor-pointer bg-gradient-to-r bg-gray-200 hover:from-blue-800 hover:to-indigo-900 hover:bg-blue-500 group hover:cursor-pointer"
          >
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-white">Formulir Input Perolehan Suara</h3>
            <p className="mt-1 text-sm text-gray-600 group-hover:text-white">Formulir input data untuk pemantauan hasil suara</p>
          </button>
        </div>

        <div className="w-full mt-6">
          {!activeForm && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">Pilih formulir yang akan anda input.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
