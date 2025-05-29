"use client";
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../superadmin/monitoring-superadmin/Map"), { ssr: false });

export default function MonitoringPage() {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/superadmin-monitoring');
        const data = await response.json();
        if (data.status) {
          setLocations(data.data);
        } else {
          setLocations([]);
        }
      } catch (error) {
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

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
    if (loc.status_admin === 'bantuan dikirim') statusValue = 'sudah ditangani';
    const matchesStatus = !statusFilter || statusValue === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countAman = locations.filter(loc => loc.status_monitoring === 'aman').length;
  const countRawan = locations.filter(loc => loc.status_rawan === 'Rawan').length;
  const countButuhBantuan = locations.filter(loc => loc.status_monitoring === 'butuh bantuan').length;
  const countSudahDitangani = locations.filter(loc => loc.status_admin === 'bantuan dikirim').length;

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedLocations = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-15 bg-gradient-to-tr from-blue-50 via-white to-indigo-100 flex flex-col font-sans">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 py-10 px-4 flex flex-col items-center shadow-lg mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">Dashboard Monitoring TPS Cimahi</h1>
        <p className="text-base sm:text-lg text-blue-100 text-center max-w-2xl mb-2">
          Informasi status TPS terkini untuk publik dan admin. Pantau kondisi, histori rawan, dan penanganan superadmin secara real-time.
        </p>
      </div>

      <div className="w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-10 flex-1 min-h-[500px]">
        <div className="col-span-1 flex flex-col gap-6 h-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-l-8 border-green-400 rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold text-green-700">Aman</span>
              <span className="text-3xl font-extrabold text-green-600">{countAman}</span>
              <span className="text-xs text-gray-500 mt-1">TPS Aman</span>
            </div>
            <div className="bg-white border-l-8 border-orange-400 rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold text-orange-700">Rawan</span>
              <span className="text-3xl font-extrabold text-orange-500">{countRawan}</span>
              <span className="text-xs text-gray-500 mt-1">TPS Rawan (Histori)</span>
            </div>
            <div className="bg-white border-l-8 border-red-400 rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold text-red-700">Butuh Bantuan</span>
              <span className="text-3xl font-extrabold text-red-600">{countButuhBantuan}</span>
              <span className="text-xs text-gray-500 mt-1">TPS Butuh Bantuan</span>
            </div>
            <div className="bg-white border-l-8 border-blue-400 rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold text-blue-700">Sudah Ditangani</span>
              <span className="text-3xl font-extrabold text-blue-600">{countSudahDitangani}</span>
              <span className="text-xs text-gray-500 mt-1">Ditangani Superadmin</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 mt-4">
            <h3 className="text-base font-medium text-blue-900 mb-1">Cari TPS</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari TPS atau Wilayah..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-2"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="text-base font-medium text-blue-900 mb-1">Filter Status TPS</h3>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500"
                  name="statusFilter"
                  value=""
                  checked={statusFilter === ""}
                  onChange={e => setStatusFilter("")}
                />
                <span className="ml-2">Semua Status</span>
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  className="form-radio text-green-600 focus:ring-green-500"
                  name="statusFilter"
                  value="aman"
                  checked={statusFilter === "aman"}
                  onChange={e => setStatusFilter("aman")}
                />
                <span className="ml-2 text-green-700">Aman</span>
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  className="form-radio text-red-600 focus:ring-red-500"
                  name="statusFilter"
                  value="butuh bantuan"
                  checked={statusFilter === "butuh bantuan"}
                  onChange={e => setStatusFilter("butuh bantuan")}
                />
                <span className="ml-2 text-red-700">Butuh Bantuan</span>
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500"
                  name="statusFilter"
                  value="sudah ditangani"
                  checked={statusFilter === "sudah ditangani"}
                  onChange={e => setStatusFilter("sudah ditangani")}
                />
                <span className="ml-2 text-blue-700">Sudah Ditangani</span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-4 overflow-x-auto flex flex-col h-full">
          <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">Daftar Status TPS</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 first:rounded-tl-lg">TPS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">Wilayah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">Histori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 last:rounded-tr-lg">Update Terakhir</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
                ) : filteredLocations.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada data ditemukan.</td></tr>
                ) : paginatedLocations.map((loc, idx) => {
                  let statusValue = loc.status_monitoring;
                  if (loc.status_admin === 'bantuan dikirim') statusValue = 'sudah ditangani';
                  const histori = loc.status_rawan && loc.status_rawan.toLowerCase() === 'rawan' ? 'Rawan' : '';
                  let statusLabel = '-';
                  if (statusValue === 'aman') statusLabel = 'Aman';
                  else if (statusValue === 'butuh bantuan') statusLabel = 'Butuh Bantuan';
                  else if (statusValue === 'sudah ditangani') statusLabel = 'Sudah Ditangani';
                  let updateTerakhir = 'N/A';
                  if (statusValue === 'sudah ditangani') {
                    if (loc.update_admin) {
                      const [admin, isoDate] = loc.update_admin.split(' - ');
                      let formatted = 'N/A';
                      if (isoDate) {
                        try {
                          formatted = new Date(isoDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                        } catch (e) {
                          formatted = isoDate;
                        }
                      }
                      updateTerakhir = `${admin} - ${formatted}`;
                    }
                  } else if (loc.updated_at) {
                    try {
                      updateTerakhir = new Date(loc.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                    } catch (e) {
                      updateTerakhir = loc.updated_at;
                    }
                  }
                  return (
                    <tr key={loc.id || idx} className="hover:bg-blue-50 transition-all cursor-pointer">
                      <td className="px-6 py-2 font-medium text-gray-900">{loc.no_tps}</td>
                      <td className="px-6 py-2 text-gray-700">{loc.kec}, {loc.desa}</td>
                      <td className="px-6 py-2">{histori === 'Rawan' && <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">Rawan</span>}</td>
                      <td className="px-6 py-2">
                        {statusLabel === 'Aman' && <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Aman</span>}
                        {statusLabel === 'Butuh Bantuan' && <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">Butuh Bantuan</span>}
                        {statusLabel === 'Sudah Ditangani' && <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">Sudah Ditangani</span>}
                        {statusLabel === '-' && <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">-</span>}
                      </td>
                      <td className="px-6 py-2">{updateTerakhir}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-400 mt-2">* Data di atas adalah real-time dari server.</div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
                <div>
                  <p className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{filteredLocations.length === 0 ? 0 : indexOfFirstItem + 1}</span> sampai <span className="font-medium">{Math.min(indexOfLastItem, filteredLocations.length)}</span> dari <span className="font-medium">{filteredLocations.length}</span> hasil
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                    </button>
                    {(() => {
                      const pageButtons = [];
                      const maxPageButtons = 5;
                      let startPage = Math.max(1, currentPage - 2);
                      let endPage = Math.min(totalPages, currentPage + 2);
                      if (currentPage <= 3) {
                        endPage = Math.min(totalPages, maxPageButtons);
                      } else if (currentPage >= totalPages - 2) {
                        startPage = Math.max(1, totalPages - maxPageButtons + 1);
                      }
                      if (startPage > 1) {
                        pageButtons.push(
                          <button key={1} onClick={() => setCurrentPage(1)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === 1 ? "z-10 bg-blue-600 text-white" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"}`}>1</button>
                        );
                        if (startPage > 2) {
                          pageButtons.push(<span key="start-ellipsis" className="px-2 py-2 text-gray-400">...</span>);
                        }
                      }
                      for (let i = startPage; i <= endPage; i++) {
                        if (i === 1 || i === totalPages) continue;
                        pageButtons.push(
                          <button key={i} onClick={() => setCurrentPage(i)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i ? "z-10 bg-blue-600 text-white" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"}`}>{i}</button>
                        );
                      }
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pageButtons.push(<span key="end-ellipsis" className="px-2 py-2 text-gray-400">...</span>);
                        }
                        pageButtons.push(
                          <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === totalPages ? "z-10 bg-blue-600 text-white" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"}`}>{totalPages}</button>
                        );
                      }
                      return pageButtons;
                    })()}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-8xl mx-auto rounded-2xl flex flex-col items-center justify-center px-8 my-8">
        <div className="w-full shadow-lg h-[500px] sm:h-[400px] md:h-[600px]">
          <Map
            locations={locations}
            selectedLocation={null}
            onLocationSelect={() => {}}
            onSendHelp={() => {}}
          />
        </div>
      </div>

      <footer className="w-full text-center text-gray-400 py-6 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Della Monica - Cimahi Pilkada Siaga.
      </footer>
    </div>
  );
}
