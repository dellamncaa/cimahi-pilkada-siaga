"use client";
import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Image from "next/image";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function VotingPage() {
  const [activeTab, setActiveTab] = useState("cimahi");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCimahiAll, setTotalCimahiAll] = useState(0);
  const [totalJabarAll, setTotalJabarAll] = useState(0);
  const [totalDPTAll, setTotalDPTAll] = useState(0);
  const [totalCmh1_desa, setTotalCmh1_desa] = useState(0);
  const [totalCmh2_desa, setTotalCmh2_desa] = useState(0);
  const [totalCmh3_desa, setTotalCmh3_desa] = useState(0);
  const [totalJbr1_desa, setTotalJbr1_desa] = useState(0);
  const [totalJbr2_desa, setTotalJbr2_desa] = useState(0);
  const [totalJbr3_desa, setTotalJbr3_desa] = useState(0);
  const [totalJbr4_desa, setTotalJbr4_desa] = useState(0);

  useEffect(() => {
    fetch("/api/get-kalkulasi")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
          // Calculate totals from the actual data
          const cimahiTotal = result.data.reduce(
            (acc, item) => acc + (item.cimahiAll || 0),
            0
          );
          const jabarTotal = result.data.reduce(
            (acc, item) => acc + (item.jabarAll || 0),
            0
          );
          const dptTotal = result.data.reduce(
            (acc, item) => acc + (item.allDptDesa || 0),
            0
          );

          setTotalCimahiAll(cimahiTotal);
          setTotalJabarAll(jabarTotal);
          setTotalDPTAll(dptTotal);

          // Set individual candidate totals
          setTotalCmh1_desa(
            result.data.reduce((acc, item) => acc + (item.cmh1 || 0), 0)
          );
          setTotalCmh2_desa(
            result.data.reduce((acc, item) => acc + (item.cmh2 || 0), 0)
          );
          setTotalCmh3_desa(
            result.data.reduce((acc, item) => acc + (item.cmh3 || 0), 0)
          );
          setTotalJbr1_desa(
            result.data.reduce((acc, item) => acc + (item.jbr1 || 0), 0)
          );
          setTotalJbr2_desa(
            result.data.reduce((acc, item) => acc + (item.jbr2 || 0), 0)
          );
          setTotalJbr3_desa(
            result.data.reduce((acc, item) => acc + (item.jbr3 || 0), 0)
          );
          setTotalJbr4_desa(
            result.data.reduce((acc, item) => acc + (item.jbr4 || 0), 0)
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  const barChartData = {
    labels:
      activeTab === "cimahi"
        ? ["Paslon Cimahi 1", "Paslon Cimahi 2", "Paslon Cimahi 3"]
        : [
            "Paslon Jabar 1",
            "Paslon Jabar 2",
            "Paslon Jabar 3",
            "Paslon Jabar 4",
          ],
    datasets: [
      {
        data:
          activeTab === "cimahi"
            ? [totalCmh1_desa, totalCmh2_desa, totalCmh3_desa]
            : [totalJbr1_desa, totalJbr2_desa, totalJbr3_desa, totalJbr4_desa],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(99, 54, 132, 0.5)",
        ],
      },
    ],
  };

  const pieChartData = {
    labels:
      activeTab === "cimahi"
        ? ["Paslon Cimahi 1", "Paslon Cimahi 2", "Paslon Cimahi 3"]
        : [
            "Paslon Jabar 1",
            "Paslon Jabar 2",
            "Paslon Jabar 3",
            "Paslon Jabar 4",
          ],
    datasets: [
      {
        data:
          activeTab === "cimahi"
            ? [totalCmh1_desa, totalCmh2_desa, totalCmh3_desa]
            : [totalJbr1_desa, totalJbr2_desa, totalJbr3_desa, totalJbr4_desa],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(99, 54, 132, 0.5)",
        ],
      },
    ],
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="bg-white">
        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong className="font-medium">Perhatian:</strong> Data yang ditampilkan merupakan hasil quick count. Untuk data hasil pemilihan resmi, silakan kunjungi{' '}
                  <a href="https://kpu.go.id" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-yellow-800">
                    website resmi KPU
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg">
            
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("cimahi")}
                className={`flex-1 shadow-md px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === "cimahi"
                    ? "bg-gradient-to-r from-blue-700 to-indigo-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Distribusi Suara Kota Cimahi
              </button>
              <button
                onClick={() => setActiveTab("jabar")}
                className={`flex-1 shadow-md px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === "jabar"
                    ? "bg-gradient-to-r from-blue-700 to-indigo-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Distribusi Suara Jawa Barat
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${activeTab === "cimahi" ? "md:grid-cols-3" : "md:grid-cols-4"} gap-6 mb-8`}>
            {activeTab === "cimahi" ? (
              <>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                      <Image
                        src="/cmh1.jpg"
                        alt="Candidate 1"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 1
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Dikdik - Bagja
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 to-red-500">
                      <Image
                        src="/cmh2.jpg"
                        alt="Candidate 2"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 2
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                        Ngatiyana - Adhitia
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-300 to-orange-500">
                      <Image
                        src="/cmh3.jpg"
                        alt="Candidate 3"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 3
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
                        Bilal - Mulyana
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                      <Image
                        src="/jabar1.png"
                        alt="Candidate 1"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 1
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Acep - Gitalis
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 to-red-500">
                      <Image
                        src="/jabar2.png"
                        alt="Candidate 2"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 2
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                        Jeje - Ronal
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-300 to-orange-500">
                      <Image
                        src="/jabar3.png"
                        alt="Candidate 3"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 3
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
                        Ahmad - Ilham
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-42 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600">
                      <Image
                        src="/jabar4.png"
                        alt="Candidate 4"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pasangan Calon 4
                      </h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                        Dedi - Erwan
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="shadow-md rounded-lg p-4">
            <div className={`${activeTab === "cimahi" ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 shadow-md rounded-lg">
                  <h3 className="text-lg text-center font-semibold mb-4">
                    Diagram Batang Kota Cimahi
                  </h3>
                  <div className="h-[300px] w-full">
                    <Bar
                      data={barChartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="p-4 shadow-md rounded-lg">
                  <h3 className="text-lg text-center font-semibold mb-4">
                    Diagram Lingkaran Kota Cimahi
                  </h3>
                  <div className="h-[300px] w-full">
                    <Pie
                      data={pieChartData}
                      options={{ maintainAspectRatio: false, responsive: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={`${activeTab === "jabar" ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 shadow-md rounded-lg">
                  <h3 className="text-lg text-center font-semibold mb-4">
                    Diagram Batang Jawa Barat
                  </h3>
                  <div className="h-[300px] w-full">
                    <Bar
                      data={barChartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="p-4 shadow-md rounded-lg">
                  <h3 className="text-lg text-center font-semibold mb-4">
                    Diagram Lingkaran Jawa Barat
                  </h3>
                  <div className="h-[300px] w-full">
                    <Pie
                      data={pieChartData}
                      options={{ maintainAspectRatio: false, responsive: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
