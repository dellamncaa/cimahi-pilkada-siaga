"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dynamic from "next/dynamic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function SuperadminLogistik() {
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/superadmin-logistik");
        const result = await response.json();

        if (result.status === 200) {
          setData(result.data || []);
        } else {
          console.error("Error fetching data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  const stats = {
    total: data.length,
    terkirim: data.filter((item) => item.status_logistik === "sudah").length,
    belumTerkirim: data.filter((item) => item.status_logistik === "belum")
      .length,
    persentase: data.length
      ? Math.round(
          (data.filter((item) => item.status_logistik === "sudah").length /
            data.length) *
            100
        )
      : 0,
  };
  const chartData = {
    labels: ["Cimahi Selatan", "Cimahi Tengah", "Cimahi Utara"],
    datasets: [
      {
        label: "Terkirim",
        data: [
          data.filter(
            (item) =>
              item.kec === "CIMAHI SELATAN" && item.status_logistik === "sudah"
          ).length,
          data.filter(
            (item) =>
              item.kec === "CIMAHI TENGAH" && item.status_logistik === "sudah"
          ).length,
          data.filter(
            (item) =>
              item.kec === "CIMAHI UTARA" && item.status_logistik === "sudah"
          ).length,
        ],
        backgroundColor: "rgba(34,197,94,0.85)",
        borderColor: "rgb(34,197,94)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Belum Terkirim",
        data: [
          data.filter(
            (item) =>
              item.kec === "CIMAHI SELATAN" && item.status_logistik === "belum"
          ).length,
          data.filter(
            (item) =>
              item.kec === "CIMAHI TENGAH" && item.status_logistik === "belum"
          ).length,
          data.filter(
            (item) =>
              item.kec === "CIMAHI UTARA" && item.status_logistik === "belum"
          ).length,
        ],
        backgroundColor: "rgba(239,68,68,0.85)",
        borderColor: "rgb(239,68,68)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: "Status Logistik per Kecamatan",
        color: "#111827",
        font: {
          family: "'Inter', sans-serif",
          size: 18,
          weight: "600",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: "600",
        },
        bodyColor: "#4B5563",
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 12,
        boxPadding: 6,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${value} TPS`;
          },
        },
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah TPS",
          color: "#4B5563",
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: "500",
          },
          padding: { bottom: 10 },
        },
        grid: {
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.05)",
          lineWidth: 1,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280",
          padding: 8,
        },
      },
      x: {
        title: {
          display: true,
          text: "Kecamatan",
          color: "#4B5563",
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: "500",
          },
          padding: { top: 10 },
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280",
          padding: 8,
        },
      },
    },
    barThickness: 32,
    maxBarThickness: 40,
    borderRadius: 4,
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
      },
    },
  };
  const filteredData = data.filter((item) => {
    const matchesStatus =
      selectedStatus === "all" || item.status_logistik === selectedStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      item.no_tps.toString().includes(searchLower) ||
      item.desa.toLowerCase().includes(searchLower) ||
      item.kec.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const TableRow = ({ item }) => {
    const statusDisplay =
      item.status_logistik === "sudah" ? "Terkirim" : "Belum Terkirim";
    const rowClass = item.status_logistik === "sudah" ? "bg-green-50" : "";
    const statusClass =
      item.status_logistik === "sudah"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    return (
      <tr className={`hover:bg-gray-50 transition-colors ${rowClass}`}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {item.no_tps}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.desa}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.kec}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
          >
            {statusDisplay}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.updated_at
            ? new Date(item.updated_at).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.updated_by}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white m-3 shadow rounded-lg p-6">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total TPS</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Terkirim</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.terkirim}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Belum Terkirim
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.belumTerkirim}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Persentase Terkirim
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.persentase}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div style={{ height: "300px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>{" "}
        <Map data={data} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {" "}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-700">Data Logistik</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
              <input
                type="text"
                placeholder="Cari TPS, Desa, atau Kecamatan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
                className="w-full bg-white border border-gray-200 text-gray-700 py-2 pl-10 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1); 
              }}
            >
              {" "}
              <option value="all">Semua Status</option>
              <option value="sudah">Terkirim</option>
              <option value="belum">Belum Terkirim</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Update
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((item, idx) => (
                <TableRow key={idx} item={item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Menampilkan {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
            {filteredData.length} data
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-indigo-900 text-white rounded-lg shadow hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map(
              (_, index) => {
                const pageNumber = index + 1;
                // Show only 5 pages at a time
                if (
                  pageNumber === 1 ||
                  pageNumber ===
                    Math.ceil(filteredData.length / itemsPerPage) ||
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
                // Show dots if there's a gap
                if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 py-2">
                      ...
                    </span>
                  );
                }
                return null;
              }
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
              className="px-3 py-2 bg-indigo-900 text-white rounded-lg shadow hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
