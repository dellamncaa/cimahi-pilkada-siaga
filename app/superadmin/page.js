"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function SuperadminPage() {
  const [loading, setLoading] = useState(true);
  const [logistikData, setLogistikData] = useState({
    total: 0,
    terkirim: 0,
    belum: 0,
  });
  const [monitoringData, setMonitoringData] = useState({
    total: 0,
    aman: 0,
    butuhBantuan: 0,
    ditangani: 0,
  });
  const [votingData, setVotingData] = useState({
    total: 0,
    totalSuara: 0,
    partisipasi: 0,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/superadmin-logistik")
        .then((res) => res.json())
        .then((result) => {
          if (result.status === 200) {
            const data = result.data || [];
            setLogistikData({
              total: data.length,
              terkirim: data.filter((item) => item.status_logistik === "sudah").length,
              belum: data.filter((item) => item.status_logistik === "belum").length,
            });
          }
        }),
      fetch("/api/superadmin-monitoring")
        .then((res) => res.json())
        .then((result) => {
          if (result.status === true) {
            const data = result.data || [];
            const amanCount = data.filter((item) => item.status_monitoring === "aman").length;
            const butuhBantuanCount = data.filter((item) => item.status_monitoring === "butuh bantuan").length;
            const ditanganiCount = data.filter((item) => item.status_admin === "bantuan dikirim").length;

            setMonitoringData({
              total: data.length,
              aman: amanCount,
              butuhBantuan: butuhBantuanCount,
              ditangani: ditanganiCount,
            });
          }
        }),
      fetch("/api/get-kalkulasi")
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            const data = result.data || [];
            const totals = data[0] || {};
            const totalSuara = (totals.cimahiAll || 0) + (totals.jabarAll || 0);
            const dpt = (totals.allDptDesa || 0) + (totals.allDptDesa || 0);

            setVotingData({
              total: 15,
              totalSuara,
              partisipasi: dpt > 0 ? Math.round((totalSuara / dpt) * 100) : 0,
            });
          }
        })
    ])
    .catch((error) => console.error("Error fetching data:", error))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className=" p-6  ">
      <div className="mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V7a2 2 0 00-2-2h-4l-2-2H8a2 2 0 00-2 2v16h16v-6a2 2 0 00-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Selamat Datang, Superadmin 👋
            </h2>
            <p className="text-gray-600">
              Kelola logistik, pantau TPS secara real-time, dan analisa hasil
              suara secara efisien.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/superadmin/logistik-superadmin">
          <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition duration-300 border border-gray-200 group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                📦 Logistik TPS
              </h3>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Tracking
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Terkirim:{" "}
                <span className="font-semibold text-green-600">
                  {logistikData.terkirim}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Belum Terkirim:{" "}
                <span className="font-semibold text-red-600">
                  {logistikData.belum}
                </span>
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Progress</span>
                  <span className="text-blue-600 font-semibold">
                    {logistikData.total > 0
                      ? Math.round(
                          (logistikData.terkirim / logistikData.total) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        logistikData.total > 0
                          ? (logistikData.terkirim / logistikData.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/superadmin/monitoring-superadmin">
          <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition duration-300 border border-gray-200 group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">
                📡 Monitoring TPS
              </h3>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Aman:{" "}
                <span className="font-semibold text-green-600">
                  {monitoringData.aman}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Butuh Bantuan:{" "}
                <span className="font-semibold text-red-600">
                  {monitoringData.butuhBantuan}
                </span>
              </p>
              <div className="my-2 h-1 bg-gray-300 rounded shadow-2xl" />
              <div className="text-sm text-gray-500 mt-2">
                Sudah Ditangani:{" "}
                <span className="font-semibold text-purple-600">
                  {monitoringData.ditangani} / {monitoringData.butuhBantuan}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/superadmin/voting-superadmin">
          <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition duration-300 border border-gray-200 group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600">
                🗳️ Hasil Suara
              </h3>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                Update
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Total Suara Masuk:{" "}
                <span className="font-semibold">{votingData.totalSuara}</span>
              </p>
              <p className="text-sm text-gray-500">
                Total Desa:{" "}
                <span className="font-semibold">{votingData.total}</span>
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Partisipasi</span>
                  <span className="text-green-600 font-semibold">
                    {votingData.partisipasi}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${votingData.partisipasi}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <footer className="w-full text-center text-gray-400 py-6 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Della Monica - Cimahi Pilkada Siaga.
      </footer>
    </div>
  );
}
