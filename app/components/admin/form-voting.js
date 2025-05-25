import { useState } from "react";
import kecDesaData from "@/lib/kec-desa.json";

export default function FormVoting({ handleReturn }) {
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");
  const [tpsData, setTpsData] = useState([]);
  const [selectedTps, setSelectedTps] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [kondisiLogistik, setKondisiLogistik] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [pelapor, setPelapor] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [votingData, setVotingData] = useState({
    cmh_1: "0",
    cmh_2: "0",
    cmh_3: "0",
    jbr_1: "0",
    jbr_2: "0",
    jbr_3: "0",
    jbr_4: "0"
  });

  const uniqueKecamatan = [...new Set(kecDesaData.map((item) => item.kec))];
  const filteredDesa = kecDesaData
    .filter((item) => item.kec === selectedKecamatan)
    .map((item) => ({ kode: item.kode_desa, nama: item.desa }));

  const handleKecamatanChange = (e) => {
    setSelectedKecamatan(e.target.value);
    setSelectedDesa("");
    setTpsData([]);
    setSelectedTps("");
  };

  const handleDesaChange = async (e) => {
    const desaValue = e.target.value;
    setSelectedDesa(desaValue);
    setSelectedTps(""); 

    if (desaValue) {
      setIsLoading(true);
      const selectedDesaData = kecDesaData.find(
        (item) => item.desa === desaValue
      );      try {
        console.log('Fetching TPS data for kode_desa:', selectedDesaData.kode_desa); // Debug log
        const response = await fetch(
          `/api/voting?kode_desa=${selectedDesaData.kode_desa}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch TPS data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('TPS Data received:', data); // Debug log
        if (data.tps && Array.isArray(data.tps)) {
          if (data.tps.length === 0) {
            console.log('No TPS found for this desa');
          }
          const formattedTpsData = data.tps.map((tps) => ({
            id_tps: String(tps.id_tps),
            no_tps: tps.no_tps || `TPS ${tps.id_tps}`,
            kode_desa: tps.kode_desa
          }));
          setTpsData(formattedTpsData);
        } else {
          console.error('Invalid TPS data format:', data);
          setTpsData([]);
        }
      } catch (error) {
        console.error("Error fetching TPS data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTpsData([]);
      setSelectedTps("");
    }
  };

  const handleTpsChange = async (e) => {
    const tpsId = e.target.value;
    setSelectedTps(tpsId);
    
    if (tpsId) {
      try {
        const response = await fetch(`/api/voting?id_tps=${tpsId}`);
        const data = await response.json();
        
        if (data.data) {
          setVotingData({
            cmh_1: data.data.cmh_1 || "0",
            cmh_2: data.data.cmh_2 || "0",
            cmh_3: data.data.cmh_3 || "0",
            jbr_1: data.data.jbr_1 || "0",
            jbr_2: data.data.jbr_2 || "0",
            jbr_3: data.data.jbr_3 || "0",
            jbr_4: data.data.jbr_4 || "0"
          });
        }
      } catch (error) {
        console.error("Error fetching voting data:", error);
        alert("Gagal mengambil data suara");
      }
    } else {
      setVotingData({
        cmh_1: "0",
        cmh_2: "0",
        cmh_3: "0",
        jbr_1: "0",
        jbr_2: "0",
        jbr_3: "0",
        jbr_4: "0"
      });
    }
  };

  const handleVoteChange = (field, value) => {
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setVotingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const now = new Date().toISOString();

    try {
      const selectedTPSDetails = tpsData.find((tps) => tps.id_tps === selectedTps);

      if (selectedTPSDetails) {
        const response = await fetch("/api/voting", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_tps: selectedTps,
            ...votingData,
            updated_by: pelapor,
            updated_at: now,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update voting data");
        }

        setSelectedTps("");
        setVotingData({
          cmh_1: "0",
          cmh_2: "0",
          cmh_3: "0",
          jbr_1: "0",
          jbr_2: "0",
          jbr_3: "0",
          jbr_4: "0"
        });
        setPelapor("");
        setShowConfirmation(false);
        alert("Data berhasil disimpan!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfirmationMessage = () => {
    const selectedTPSDetails = tpsData.find((tps) => tps.id_tps === selectedTps);
    const tpsInfo = selectedTPSDetails ? selectedTPSDetails.no_tps : "";

    let message = `Data yang akan dikirim:\n\n`;
    message += `Kecamatan: ${selectedKecamatan}\n`;
    message += `Desa: ${selectedDesa}\n`;
    message += `TPS: ${tpsInfo}\n\n`;
    message += `Perolehan Suara Kota Cimahi:\n`;
    message += `CMH1: ${votingData.cmh_1}\n`;
    message += `CMH2: ${votingData.cmh_2}\n`;
    message += `CMH3: ${votingData.cmh_3}\n\n`;
    message += `Perolehan Suara Provinsi Jawa Barat:\n`;
    message += `JBR1: ${votingData.jbr_1}\n`;
    message += `JBR2: ${votingData.jbr_2}\n`;
    message += `JBR3: ${votingData.jbr_3}\n`;
    message += `JBR4: ${votingData.jbr_4}\n`;
    message += `Pelapor: ${pelapor}\n`;

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
        <h2 className="text-xl font-bold">Formulir Input Data Pemilihan</h2>
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
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500"
            disabled={!selectedDesa}
            value={selectedTps}
            onChange={handleTpsChange}
          >
            <option value="" className="text-gray-500">
              --- Pilih TPS ---
            </option>
            {isLoading ? (
              <option disabled>Loading data TPS...</option>
            ) : !selectedDesa ? (
              <option disabled>Silakan pilih desa terlebih dahulu</option>
            ) : tpsData.length === 0 ? (
              <option disabled>Tidak ada data TPS untuk desa ini</option>
            ) : (
              tpsData.map((tps) => (
                <option key={tps.id_tps} value={tps.id_tps} className="text-black">
                  {tps.no_tps}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedTps && (
          <>
            <div className="mt-6">
              <h3 className="font-bold mb-4">Perolehan Suara Kota Cimahi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium">
                    CMH1 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.cmh_1}
                    onChange={(e) => handleVoteChange("cmh_1", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    CMH2 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.cmh_2}
                    onChange={(e) => handleVoteChange("cmh_2", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    CMH3 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.cmh_3}
                    onChange={(e) => handleVoteChange("cmh_3", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-4">Perolehan Suara Provinsi Jawa Barat</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-1 font-medium">
                    JBR1 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.jbr_1}
                    onChange={(e) => handleVoteChange("jbr_1", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    JBR2 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.jbr_2}
                    onChange={(e) => handleVoteChange("jbr_2", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    JBR3 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.jbr_3}
                    onChange={(e) => handleVoteChange("jbr_3", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    JBR4 <span className="text-red-500 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={votingData.jbr_4}
                    onChange={(e) => handleVoteChange("jbr_4", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Jumlah suara"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-1 font-medium">
                Nama Pelapor <span className="text-red-500 text-sm">*</span>
              </label>
              <input
                type="text"
                required
                value={pelapor}
                onChange={(e) => setPelapor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Masukkan nama pelapor"
              />
            </div>
          </>
        )}

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
