import { useState } from "react";
import kecDesaData from "@/lib/kec-desa.json";

export default function FormLogistik({ handleReturn }) {
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");
  const [tpsData, setTpsData] = useState([]);
  const [selectedTps, setSelectedTps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [kondisiLogistik, setKondisiLogistik] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [pelapor, setPelapor] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);

  const uniqueKecamatan = [...new Set(kecDesaData.map((item) => item.kec))];

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
      );      try {
        const response = await fetch(
          `/api/get-tps-form-logistik?kode_desa=${selectedDesaData.kode_desa}`
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
        setKondisiLogistik("");
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
        console.log(
          "Updating TPS:",
          tps.id_tps,
          "with status:",
          kondisiLogistik
        );

        const response = await fetch("/api/update-tps-logistik", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_tps: String(tps.id_tps),
            status_logistik: kondisiLogistik === "belum" ? "belum" : "sudah",
            updated_by: pelapor,
            updated_at: now
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || `Failed to update TPS: ${response.status} ${response.statusText}`);
        }
      }

      setSelectedTps([]);
      setKondisiLogistik("");
      setKeterangan("");
      setPelapor("");
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
    message += `Status Distribusi: ${
      kondisiLogistik === "sudah"
        ? "Sudah Terdistribusi"
        : "Belum Terdistribusi"
    }\n`;
    if (kondisiLogistik === "belum") {
      message += `Keterangan: ${keterangan}\n`;
    }
    message += `Pelapor: ${pelapor}\n\n`;

    message += `Apakah Anda yakin ingin mengirim data ini?`;
    message += `\n\nCatatan: Pastikan semua data sudah benar sebelum mengirim.`;
    message += `\n\nJika Anda yakin, silakan klik "Konfirmasi".`;
    message += `\nJika tidak, silakan klik "Batal".`;

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
        <h2 className="text-xl font-bold">Formulir Input Data Logistik</h2>
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
                    TPS 0{tps.no_tps}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Kondisi Logistik <span className="text-red-500 text-sm">*</span>
          </label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
            disabled={selectedTps.length === 0}
            value={kondisiLogistik}
            onChange={(e) => {
              setKondisiLogistik(e.target.value);
              if (e.target.value !== "belum") {
                setKeterangan("");
              }
            }}
          >
            <option value="" className="text-gray-500">
              --- Pilih Status ---
            </option>
            <option value="sudah" className="text-black">
              Sudah Terdistribusi
            </option>
            <option value="belum" className="text-black">
              Belum Terdistribusi
            </option>
          </select>
        </div>

        {kondisiLogistik === "belum" && (
          <div>
            <label className="block mb-1 font-medium">
              Keterangan <span className="text-red-500 text-sm">*</span>
            </label>
            <textarea
              required
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Masukkan keterangan mengapa belum terdistribusi"
              rows={3}
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            Pelapor <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            required
            type="text"
            value={pelapor}
            onChange={(e) => setPelapor(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="Masukkan informasi pelapor"
          />
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
