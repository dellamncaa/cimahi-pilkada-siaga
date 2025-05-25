"use client";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";
import { useState, useEffect, useRef } from "react";

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <span ref={counterRef}>{count.toLocaleString()}</span>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-200 pt-16 relative z-0">
        <section className="pt-16 pb-20 px-10">
          <div className="container mx-auto px-4">
            <div className="flex px-8 flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white max-w-2xl">
                <h1 className="text-2xl md:text-5xl font-bold mb-4">
                  Selamat Datang di
                </h1>
                <h1 className="text-2xl md:text-5xl font-bold mb-4">
                  Cimahi Pilkada Siaga
                </h1>
                <p className="text-lg md:text-xl mb-8 text-blue-100">
                  Platform pemantauan bencana sebagai upaya mitigasi risiko
                  dalam pelaksanaan Pemilihan Kepala Daerah di Kota Cimahi.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/monitoring"
                    className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200 transition duration-300"
                  >
                    Lihat Pantauan Lapangan
                  </Link>
                  <Link
                    href="/map"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-300"
                  >
                    Peta TPS Cimahi
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-[650px]">
                <Image
                  src="/home.png"
                  alt="Kota Cimahi"
                  width={800}
                  height={400}
                  className="w-full h-auto p-10"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Fitur Utama
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Pemantauan Lapangan
                </h3>
                <p className="text-gray-600">
                  Pantau kondisi terkini terkait kebencanaan di lapangan dari
                  tim pemantau pada saat Pilkada berlangsung.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Peta Sebaran TPS
                </h3>
                <p className="text-gray-600">
                  Lihat lokasi dan informasi detail setiap TPS melalui peta
                  interaktif.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Rekapitulasi Suara
                </h3>
                <p className="text-gray-600">
                  Lihat hasil perhitungan suara secara cepat (quick count)
                  secara real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-10 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              Tentang Pantauan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2 text-blue-200">
                  <AnimatedCounter end={823} />
                </div>
                <div className="text-xl mb-4">TPS Terpantau</div>
                <p className="text-blue-200">
                  Tempat Pemungutan Suara yang dipantau secara aktif di seluruh
                  Kota Cimahi
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2 text-blue-200">
                  <AnimatedCounter end={15} />
                </div>
                <div className="text-xl mb-4">Tim Lapangan</div>
                <p className="text-blue-200">
                  Personel yang bertugas memantau dan melaporkan situasi
                  lapangan di setiap desa
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-gray-800">
              Bagaimana Sistem Ini Bekerja
            </h2>
            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200 -z-10"></div>
              
              <div className="space-y-12 relative">
                <div className="flex flex-col lg:flex-row items-center justify-center">
                  <div className="flex-1 lg:text-right lg:pr-12 order-2 lg:order-1 w-full lg:w-auto">
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-3 text-blue-900">Pemantauan Lapangan</h3>
                      <p className="text-gray-600">Tim lapangan melakukan pemantauan dan mengumpulkan informasi data logistik dan kebencanaan di setiap TPS.</p>
                    </div>
                  </div>
                  <div className="my-4 lg:my-0 order-1 lg:order-2 z-10">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
                  </div>
                  <div className="flex-1 lg:pl-12 hidden lg:block order-3"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center">
                  <div className="flex-1 lg:text-right lg:pr-12 hidden lg:block order-1"></div>
                  <div className="my-4 lg:my-0 order-2 z-10">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
                  </div>
                  <div className="flex-1 lg:pl-12 order-3 w-full lg:w-auto">
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-3 text-blue-900">Pelaporan Data</h3>
                      <p className="text-gray-600">TPS yang mengalami permasalahan kebencanaan atau logistik dan membutuhkan penanganan cepat harus segera dilaporkan oleh tim lapangan.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center">
                  <div className="flex-1 lg:text-right lg:pr-12 order-2 lg:order-1 w-full lg:w-auto">
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-3 text-blue-900">Penanggulangan Bencana</h3>
                      <p className="text-gray-600">Pemerintah Kota Cimahi akan segera mengirimkan bantuan ke lokasi yang dilaporkan sebagai darurat setelah menerima informasi secara langsung.</p>
                    </div>
                  </div>
                  <div className="my-4 lg:my-0 order-1 lg:order-2 z-10">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
                  </div>
                  <div className="flex-1 lg:pl-12 hidden lg:block order-3"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center">
                  <div className="flex-1 lg:text-right lg:pr-12 hidden lg:block order-1"></div>
                  <div className="my-4 lg:my-0 order-2 z-10">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">4</div>
                  </div>
                  <div className="flex-1 lg:pl-12 order-3 w-full lg:w-auto">
                    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-xl font-bold mb-3 text-blue-900">Arsip Pantauan Lapangan</h3>
                      <p className="text-gray-600">Catatan hasil pemantauan terkait bencana maupun logistik yang telah selesai akan disimpan secara otomatis ke dalam basis data, sehingga dapat mempermudah analisis dan antisipasi pada penyelenggaraan Pilkada di masa yang akan datang.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
