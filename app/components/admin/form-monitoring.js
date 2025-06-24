import { useState, useEffect } from "react";
import kecDesaData from "@/lib/kec-desa.json";

export default function FormMonitoring({ handleReturn, user }) {
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");
  const [tpsData, setTpsData] = useState([]);
  const [selectedTps, setSelectedTps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusPantauan, setStatusPantauan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [pelapor, setPelapor] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  
  const uniqueKecamatan = [...new Set(kecDesaData.map((item) => item.kec))];

  // Set default reporter from logged in user
  useEffect(() => {
    if (user && user.email) {
      setPelapor(user.email.split("@")[0]); // Use email username part
      // Or use full email: setPelapor(user.email);
    }
  }, [user]);

  const filteredDesa = kecDesaData
    .filter((item) => item.kec === selectedKecamatan)
    .map((item) => ({ kode: item.kode_desa, nama: item.desa }));

  const handleKecamatanChange = (e) => {
    setSelectedKecamatan(e.target.value);
    setSelectedDesa("");
    setTpsData([]);
    setSelectedTps([]);
  };

  const handleDesaChange = async (e) => {
    const desaValue = e.target.value;
    setSelectedDesa(desaValue);

    if (desaValue) {
      setIsLoading(true);
      const selectedDesaData = kecDesaData.find(
        (item) => item.desa === desaValue
      );
      try {
        const response = await fetch(
          `/api/get-tps-form-monitoring?kode_desa=${selectedDesaData.kode_desa}`
        );
        const data = await response.json();
        if (data.tps) {
          const formattedTpsData = data.tps.map((tps) => ({
            ...tps,
            id_tps: String(tps.id_tps),
          }));
          setTpsData(formattedTpsData);
        }
      } catch (error) {
        console.error("Error fetching TPS data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTpsData([]);
      setSelectedTps([]);
    }
  };

  const handleTpsChange = (tpsId) => {
    const tpsIdString = String(tpsId);
    setSelectedTps((prev) => {
      const newSelectedTps = prev.includes(tpsIdString)
        ? prev.filter((id) => id !== tpsIdString)
        : [...prev, tpsIdString];

      if (newSelectedTps.length === 0) {
        setStatusPantauan("");
      }

      return newSelectedTps;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const now = new Date().toISOString();

    try {
      const selectedTPSDetails = tpsData.filter((tps) =>
        selectedTps.includes(String(tps.id_tps))
      );

      for (const tps of selectedTPSDetails) {
        const response = await fetch("/api/update-tps-monitoring", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_tps: String(tps.id_tps),
            status_monitoring: statusPantauan,
            updated_by: pelapor,
            updated_at: now,
            keterangan: keterangan,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update TPS");
        }
      }
      setSelectedTps([]);
      setStatusPantauan("");
      setKeterangan("");
      // Reset to default user email instead of empty string
      setPelapor(user?.email?.split("@")[0] || "");
      setShowConfirmation(false);
      alert("Data berhasil disimpan!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfirmationMessage = () => {
    const selectedTPSDetails = tpsData.filter((tps) =>
      selectedTps.includes(tps.id_tps)
    );
    const tpsInfo = selectedTPSDetails.map((tps) => `${tps.no_tps}`).join(", ");

    let message = `Data yang akan dikirim:\n\n`;
    message += `Kecamatan: ${selectedKecamatan}\n`;
    message += `Desa: ${selectedDesa}\n`;
    message += `${tpsInfo}\n`;
    message += `Status Rawan: ${
      statusPantauan === "aman"
        ? "Aman tidak terkendala bencana"
        : "Terkendala dan butuh bantuan"
    }\n`;
    if (statusPantauan === "butuh bantuan") {
      message += `Keterangan: ${keterangan}\n`;
    }
    message += `Pelapor: ${pelapor}\n\n`;

    message += `Apakah Anda yakin ingin mengirim data ini?`;
    message += `\n\nSilakan klik "Konfirmasi" untuk melanjutkan.`;
    message += `\n\nJika ada kesalahan, silakan klik "Batal" untuk kembali ke formulir.`;
    return message;
  };

  const handleBackClick = () => {
    setShowBackConfirmation(true);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center mb-4">
        <button
          onClick={handleBackClick}
          className="pr-4 py-2 text-black rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6 hover:text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold">Formulir Input Data Monitoring</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">
            Pilih Kecamatan <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
            value={selectedKecamatan}
            onChange={handleKecamatanChange}
          >
            <option value="" className="text-gray-500">
              --- Pilih Kecamatan ---
            </option>
            {uniqueKecamatan.map((kecamatan) => (
              <option key={kecamatan} value={kecamatan} className="text-black">
                {kecamatan}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Pilih Desa <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
            disabled={!selectedKecamatan}
            value={selectedDesa}
            onChange={handleDesaChange}
          >
            <option value="" className="text-gray-500">
              --- Pilih Desa ---
            </option>
            {filteredDesa.map((desa) => (
              <option key={desa.kode} value={desa.nama} className="text-black">
                {desa.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Pilih TPS <span className="text-red-500 text-sm">*</span>
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading data TPS...</p>
            ) : !selectedDesa ? (
              <p className="text-gray-500 text-sm">
                Silakan pilih desa terlebih dahulu
              </p>
            ) : tpsData.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Tidak ada data TPS untuk desa ini
              </p>
            ) : (
              tpsData.map((tps) => (
                <div key={tps.id_tps} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tps-${tps.id_tps}`}
                    checked={selectedTps.includes(tps.id_tps)}
                    onChange={() => handleTpsChange(tps.id_tps)}
                    className="mr-2"
                  />
                  <label htmlFor={`tps-${tps.id_tps}`} className="text-sm">
                    {tps.no_tps}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Kondisi Lapangan <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
            disabled={selectedTps.length === 0}
            value={statusPantauan}
            onChange={(e) => {
              setStatusPantauan(e.target.value);
              if (e.target.value !== "butuh bantuan") {
                setKeterangan("");
              }
            }}
          >
            <option value="" className="text-gray-500">
              --- Pilih Status ---
            </option>
            <option value="aman" className="text-black">
              Aman tidak terkendala bencana
            </option>
            <option value="butuh bantuan" className="text-black">
              Terkendala dan butuh bantuan
            </option>
          </select>
        </div>

        {statusPantauan === "butuh bantuan" && (
          <div>
            <label className="block mb-1 font-medium">
              Keterangan <span className="text-red-500 text-sm">*</span>
            </label>
            <textarea
              required
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Masukkan keterangan lebih detail terkait kondisi lapangan"
              rows={3}
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            Pelapor <span className="text-red-500 text-sm">*</span>
          </label>
          <div className="relative">
            <input
              required
              type="text"
              value={pelapor}
              readOnly
              onChange={(e) => setPelapor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              placeholder="Masukkan informasi pelapor"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-md hover:from-blue-500 hover:to-indigo-700 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Data"}
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">
              Konfirmasi Pengiriman Data
            </h3>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm mb-4">
              {getConfirmationMessage()}
            </pre>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-md hover:from-blue-500 hover:to-indigo-700 transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Mengirim..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackConfirmation && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Kembali</h3>
            <p className="mb-4">
              Apakah Anda yakin ingin kembali? Semua data yang belum disimpan
              akan hilang.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBackConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleReturn}
                className="px-4 py-2 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-md hover:from-blue-500 hover:to-indigo-700 transition duration-200"
              >
                Ya, Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}