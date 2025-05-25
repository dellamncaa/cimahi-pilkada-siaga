"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./Map.module.css";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "map-legend");
      div.innerHTML = `
        <div class="legend-item">
          <div class="legend-marker-wrapper">
            <div class="legend-point-delivered"></div>
          </div>
          <span>Terkirim</span>
        </div>
        <div class="legend-item">
          <div class="legend-marker-wrapper">
            <div class="legend-point-undelivered"></div>
          </div>
          <span>Belum Terkirim</span>
        </div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

const createStatusIcon = (status) => {
  if (status !== "sudah" && status !== "belum") {
    return null;
  }
  const color = status === "sudah" ? "#22c55e" : "#ef4444";
  const isDelivered = status === "sudah";
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="${isDelivered ? 'marker-delivered' : 'marker-undelivered'}" style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const Map = ({ data }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch("/cimahi.geojson")
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className={styles.mapWrapper}>
        <MapContainer
          center={[-6.874824534783002, 107.5372340986877]}
          zoom={12}
          scrollWheelZoom={true}
        >
          {" "}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={{
                fillColor: "#3B82F6",
                fillOpacity: 0.1,
                color: "#2563EB",
                weight: 2,
              }}
            />
          )}
          {data.map((item, idx) => {
            const icon = createStatusIcon(item.status_logistik);
            return icon ? (
              <Marker
                key={idx}
                position={[item.latitude, item.longitude]}
                icon={icon}
              >
                {" "}
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-blue-100 p-1.5 rounded-md">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          TPS {item.no_tps}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {item.desa}, {item.kec}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-md p-1.5 mb-2 text-xs text-gray-600">
                      {item.alamat}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            item.status_logistik === "sudah"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status_logistik === "sudah"
                            ? "Terkirim"
                            : "Belum Terkirim"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Update</span>
                        <span className="font-medium text-gray-700">
                          {new Date(item.updated_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-gray-500">Petugas</span>
                        <span className="font-medium text-gray-700">
                          {item.updated_by}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null;
          })}
          <Legend />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
