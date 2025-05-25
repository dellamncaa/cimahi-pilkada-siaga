"use client";

import { motion } from "framer-motion";
import { Activity, MapPin, Users, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
	{
		icon: <MapPin className="w-7 h-7 text-blue-500" />,
		title: "Peta Sebaran TPS",
		description:
			"Lihat lokasi dan informasi detail setiap TPS melalui peta interaktif yang responsif dan real-time.",
	},
	{
		icon: <Activity className="w-7 h-7 text-red-500" />,
		title: "Pemantauan Lapangan",
		description:
			"Pantau kondisi terkini terkait kebencanaan secara langsung dari tim pemantau saat Pilkada berlangsung.",
	},
	{
		icon: <Users className="w-7 h-7 text-green-600" />,
		title: "Rekapitulasi Suara",
		description:
			"Dapatkan hasil quick count secara cepat dan real-time dari masing-masing TPS.",
	},
	{
		icon: <ShieldCheck className="w-7 h-7 text-purple-500" />,
		title: "Admin & Superadmin",
		description:
			"Admin menginput data pemantauan, sedangkan Superadmin memantau distribusi logistik di tiap TPS.",
	},
];

export default function AboutPage() {
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
		<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
			<div className="max-w-7xl mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="mb-6"
				>
					<h1 className="text-4xl font-bold text-indigo-900 my-8">
						Tentang Aplikasi Cimahi Pilkada Siaga
					</h1>
					<p className="text-lg text-gray-600 mb-3">
						Cidaga adalah platform WebGIS inovatif yang dirancang untuk memantau
						kondisi kebencanaan di Kota Cimahi selama pelaksanaan Pemilihan
						Kepala Daerah. Dengan pendekatan teknologi spasial, Cidaga membantu
						mengurangi risiko hambatan akibat bencana melalui informasi
						real-time dan visualisasi interaktif.
					</p>
					<p className="text-lg text-gray-600 mb-5">
						Aplikasi ini menjadi langkah preventif dalam mendukung pemilu yang
						aman, akurat, dan inklusif serta memberi wewenang lebih bagi
						pemantau lapangan, petugas admin, dan superadmin dalam mengelola
						data kebencanaan dan distribusi logistik.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
						>
							<div className="flex items-center mb-4">
								{feature.icon}
								<h3 className="ml-4 text-xl font-semibold text-gray-800">
									{feature.title}
								</h3>
							</div>
							<p className="text-gray-600 text-left">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
			<div className="mt-12 text-center">
				<p className="text-gray-500">
					&copy; {new Date().getFullYear()} Della Monica - Cimahi Pilkada Siaga.
				</p>
			</div>
		</div>
	);
}
