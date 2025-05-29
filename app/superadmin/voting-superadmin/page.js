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
import {
  VoteIcon,
  PollIcon,
  PercentageIcon,
} from "@/app/components/superadmin/icon-voting";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SuperadminVoting() {
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
    <div className="bg-white m-3 shadow rounded-lg">
      <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 shadow-md p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-white mt-1">
                <VoteIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-start font-semibold text-white">
                  Total Suara Masuk{" "}
                  {activeTab === "jabar" ? "Jawa Barat" : "Kota Cimahi"}
                </h3>
                <p className="text-3xl text-start font-bold text-white">
                  {activeTab === "jabar" ? totalJabarAll : totalCimahiAll}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-purple-400 shadow-md p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-white mt-1">
                <PollIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Total TPS</h3>
                <p className="text-3xl font-bold text-white">823</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-red-600 shadow-md p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-white mt-1">
                <PercentageIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  Tingkat Partisipasi Pemilih
                </h3>
                <p className="text-3xl font-bold text-white">
                  {(
                    ((activeTab === "jabar" ? totalJabarAll : totalCimahiAll) /
                      totalDPTAll) *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          </div>
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
        <div className="shadow-md rounded-lg p-4">
          <h3 className="text-xl text-center font-semibold mb-4">
            Rekapitulasi Suara Masuk{" "}
            {activeTab === "jabar" ? "Jawa Barat" : "Kota Cimahi"}
          </h3>
          <div className={`${activeTab === "cimahi" ? "block" : "hidden"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Desa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total DPT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Suara Masuk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 3
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.tps_location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.allDptDesa?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.cimahiAll?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.cmh1?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.cmh2?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.cmh3?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={`${activeTab === "jabar" ? "block" : "hidden"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Desa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total DPT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Suara Masuk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 3
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Suara Paslon 4
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.tps_location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.allDptDesa?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.jabarAll?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.jbr1?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.jbr2?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.jbr3?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.jbr4?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}