"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function SuperadminMonitoring() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/superadmin-monitoring");
        const data = await response.json();
        if (data.status) {
          setLocations(data.data);
        } else {
          console.error("Failed to fetch locations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
    window.fetchLocations = fetchLocations;
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleSendHelp = async (locationId) => {
    const adminName = "Admin"; 
    const now = new Date().toISOString();
    try {
      await fetch("/api/update-tps-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_tps: locationId,
          status_admin: "bantuan dikirim",
          update_admin: `${adminName} - ${now}`,
        }),
      });
      if (window.fetchLocations) window.fetchLocations();
    } catch (error) {
      alert("Gagal mengirim bantuan");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredLocations = locations.filter((loc) => {
    if (!searchTerm && !statusFilter) return true;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (loc.no_tps?.toString() || "").toLowerCase().includes(searchTermLower) ||
      (loc.kec?.toString() || "").toLowerCase().includes(searchTermLower) ||
      (loc.desa?.toString() || "").toLowerCase().includes(searchTermLower) ||
      (loc.alamat?.toString() || "").toLowerCase().includes(searchTermLower);
    let statusValue = loc.status_monitoring;
    if (loc.status_admin === "bantuan dikirim") statusValue = "sudah ditangani";
    const matchesStatus = !statusFilter || statusValue === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const currentItems = filteredLocations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 h-screen flex flex-col">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-50 rounded-xl">
                  <svg
                    className="h-8 w-8 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aman
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {
                        locations.filter(
                          (loc) => loc.status_monitoring === "aman"
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-yellow-50 rounded-xl">
                  <svg
                    className="h-8 w-8 text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-5 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Histori Rawan
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {
                        locations.filter((loc) => loc.status_rawan === "Rawan")
                          .length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-red-50 rounded-xl">
                  <svg
                    className="h-8 w-8 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Butuh Bantuan
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {
                        locations.filter(
                          (loc) => loc.status_monitoring === "butuh bantuan"
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-xl">
                  <svg
                    className="h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="ml-5 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Sudah Ditangani
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {
                        locations.filter(
                          (loc) => loc.status_admin === "bantuan dikirim"
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-12 gap-6" style={{ height: "650px" }}>
            <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="h-full">
                <Map
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={setSelectedLocation}
                  onSendHelp={handleSendHelp}
                />
              </div>
            </div>

            <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-0">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Situasi Butuh Bantuan
              </h3>
              <div className="flex-1 overflow-auto space-y-4 pr-2">
                {locations
                  .filter(
                    (loc) =>
                      loc.status_monitoring === "butuh bantuan" &&
                      loc.status_admin !== "bantuan dikirim"
                  )
                  .map((location) => (
                    <div
                      key={location.id}
                      className="p-4 bg-red-50 rounded-xl border border-red-200 cursor-pointer transition-all hover:shadow-md"
                      onClick={() => setSelectedLocation(location)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-red-800">
                          {location.no_tps}
                        </h4>
                        <span className="text-xs text-red-600">
                          {location.updated_at
                            ? new Date(location.updated_at).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-red-700">
                        {location.issue}
                      </p>
                      <div className="mt-3 text-xs text-red-600">
                        {location.kec}
                      </div>
                      <div className="mt-1 text-xs text-red-600">
                        Dilaporkan oleh: {location.update_by}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendHelp(location.id);
                        }}
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Kirim Bantuan
                      </button>
                    </div>
                  ))}
                {locations.filter(
                  (loc) =>
                    loc.status_monitoring === "butuh bantuan" &&
                    loc.status_admin !== "bantuan dikirim"
                ).length === 0 && (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">
                      Tidak ada situasi butuh bantuan saat ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl mb-4 shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="row-span-1 bg-white rounded-xl  p-0 flex flex-col min-h-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 w-full sm:w-auto mb-2 sm:mb-0">
                  Daftar TPS
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Cari TPS..."
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); 
                      }}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <select
                    className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1); 
                    }}
                  >
                    <option value="">Semua Status</option>
                    <option value="aman">Aman</option>
                    <option value="butuh bantuan">Butuh Bantuan</option>
                    <option value="sudah ditangani">Sudah Ditangani</option>
                  </select>
                  <button
                    onClick={() => {
                      const headers = [
                        "TPS",
                        "Wilayah",
                        "Histori",
                        "Status",
                        "Update Terakhir",
                      ];
                      const rows = filteredLocations.map((location) => {
                        let statusValue = location.status_monitoring;
                        if (location.status_admin === "bantuan dikirim")
                          statusValue = "sudah ditangani";
                        const histori =
                          location.status_rawan &&
                          location.status_rawan.toLowerCase() === "rawan"
                            ? "Rawan"
                            : "";
                        let statusLabel = "-";
                        if (statusValue === "aman") statusLabel = "Aman";
                        else if (statusValue === "butuh bantuan")
                          statusLabel = "Butuh Bantuan";
                        else if (statusValue === "sudah ditangani")
                          statusLabel = "Sudah Ditangani";
                        let updateTerakhir = "N/A";
                        if (statusValue === "sudah ditangani") {
                          if (location.update_admin) {
                            const [admin, isoDate] =
                              location.update_admin.split(" - ");
                            let formatted = "N/A";
                            if (isoDate) {
                              try {
                                formatted = format(
                                  new Date(isoDate),
                                  "dd MMM yyyy HH:mm",
                                  { locale: id }
                                );
                              } catch (e) {
                                formatted = isoDate;
                              }
                            }
                            updateTerakhir = `${admin} - ${formatted}`;
                          }
                        } else if (location.updated_at) {
                          try {
                            updateTerakhir = format(
                              new Date(location.updated_at),
                              "dd MMM yyyy HH:mm",
                              { locale: id }
                            );
                          } catch (e) {
                            updateTerakhir = location.updated_at;
                          }
                        }
                        return [
                          location.no_tps,
                          `${location.kec}, ${location.desa}`,
                          histori,
                          statusLabel,
                          updateTerakhir,
                        ];
                      });
                      const csvContent = [
                        headers.join(","),
                        ...rows.map((row) =>
                          row
                            .map(
                              (field) =>
                                `"${(field || "")
                                  .toString()
                                  .replace(/"/g, '""')}"`
                            )
                            .join(",")
                        ),
                      ].join("\r\n");
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", "tps-monitoring.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mb-2 sm:mb-0 text-sm"
                  >
                    Download CSV
                  </button>
                </div>
              </div>

              <div className="flex-1 rounded-lg overflow-x-auto">
                <table className="w-full min-w-[600px] divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 first:rounded-tl-lg">
                        TPS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                        Wilayah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                        Histori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 last:rounded-tr-lg">
                        Update Terakhir
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-gray-400 text-sm"
                        >
                          Tidak ada data ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((location) => {
                        let statusValue = location.status_monitoring;
                        if (location.status_admin === "bantuan dikirim")
                          statusValue = "sudah ditangani";
                        return (
                          <tr
                            key={location.id}
                            onClick={() => setSelectedLocation(location)}
                            className="hover:bg-gray-50 cursor-pointer transition-all"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {location.no_tps}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {location.kec}, {location.desa}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {location.status_rawan &&
                              location.status_rawan.toLowerCase() ===
                                "rawan" ? (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Rawan
                                </span>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${
                                    statusValue === "aman"
                                      ? "bg-green-100 text-green-800"
                                      : ""
                                  }
                                  ${
                                    statusValue === "butuh bantuan"
                                      ? "bg-red-100 text-red-800"
                                      : ""
                                  }
                                  ${
                                    statusValue === "sudah ditangani"
                                      ? "bg-blue-100 text-blue-800"
                                      : ""
                                  }
                                `}
                              >
                                {statusValue === "aman"
                                  ? "Aman"
                                  : statusValue === "butuh bantuan"
                                  ? "Butuh Bantuan"
                                  : statusValue === "sudah ditangani"
                                  ? "Sudah Ditangani"
                                  : "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {statusValue === "sudah ditangani"
                                ? location.update_admin
                                  ? (() => {
                                      const [admin, isoDate] =
                                        location.update_admin.split(" - ");
                                      let formatted = "N/A";
                                      if (isoDate) {
                                        try {
                                          formatted = format(
                                            new Date(isoDate),
                                            "dd MMM yyyy HH:mm",
                                            { locale: id }
                                          );
                                        } catch (e) {
                                          formatted = isoDate;
                                        }
                                      }
                                      return `${admin} - ${formatted}`;
                                    })()
                                  : "N/A"
                                : location.updated_at
                                ? format(
                                    new Date(location.updated_at),
                                    "dd MMM yyyy HH:mm",
                                    { locale: id }
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Menampilkan {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, filteredLocations.length)} dari{" "}
                    {filteredLocations.length} data
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-indigo-900 text-white rounded-lg shadow hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    {[
                      ...Array(Math.ceil(filteredLocations.length / itemsPerPage)),
                    ].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber ===
                          Math.ceil(filteredLocations.length / itemsPerPage) ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-2 rounded-lg shadow transition ${
                              currentPage === pageNumber
                                ? "bg-indigo-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 py-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredLocations.length / itemsPerPage)
                      }
                      className="px-3 py-2 bg-indigo-900 text-white rounded-lg shadow hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
