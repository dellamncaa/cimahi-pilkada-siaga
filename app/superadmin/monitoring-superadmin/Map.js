"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMap,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";
import GeoTIFFLayer from "./GeoTIFFLayer";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.7.1/dist/images/";

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomright" });
    const div = L.DomUtil.create("div", "map-legend");    legend.onAdd = () => {
      div.innerHTML = `
        <div class="legend-item">
          <div class="legend-circle" style="background-color: #ef4444;"></div>
          <span>Butuh Bantuan</span>
        </div>
        <div class="legend-item">
          <div class="legend-point" style="background-color: #22c55e;"></div>
          <span>Aman</span>
        </div>
        <div class="legend-item">
          <div class="legend-point" style="background-color: #eab308;"></div>
          <span>Rawan</span>
        </div>
        <div class="legend-item">
          <div class="legend-point" style="background-color: #3b82f6;"></div>
          <span>Sudah Ditangani</span>
        </div>
        <div class="legend-separator"></div>
        <div class="legend-title">Tingkat Kerawanan</div>
        <div class="legend-gradient">
          <div class="gradient-bar"></div>
          <div class="gradient-labels">
            <span>Rendah</span>
            <span>Tinggi</span>
          </div>
        </div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
      if (div && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    };
  }, [map]);

  return null;
};

const createStatusIcon = (status) => {
  if (status === "butuh bantuan") {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-emergency"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }

  let pointClass = "";
  switch (status) {
    case "aman":
      pointClass = "marker-point-aman";
      break;
    case "rawan":
      pointClass = "marker-point-rawan";
      break;
    case "sudah ditangani":
      pointClass = "marker-point-ditangani";
      break;
    default:
      pointClass = "marker-point-aman";
  }

  return L.divIcon({
    className: "custom-div-icon",
    html: `<div class="marker-point"><div class="marker-point-content ${pointClass}"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

export default function Map({
  locations,
  selectedLocation,
  onLocationSelect,
  onSendHelp,
}) {
  const defaultCenter = [-6.8718189, 107.5413039];
  const [geojson, setGeojson] = useState(null);

  const geoTiffUrl = "/kerawanan.tif";

  useEffect(() => {
    fetch("/cimahi.geojson")
      .then((res) => res.json())
      .then(setGeojson);
  }, []);

  const markerCoordinates = useMemo(() => {
    return locations
      .map((location) => {
        if (!location.latitude || !location.longitude) {
          console.error(`Missing coordinates for location ID: ${location.id}`);
          return null;
        }
        let markerStatus = location.status_monitoring;
        if (location.status_admin === "bantuan dikirim") {
          markerStatus = "sudah ditangani";
        }
        return {
          ...location,
          lat: location.latitude,
          lng: location.longitude,
          status: markerStatus,
        };
      })
      .filter(Boolean);
  }, [locations]);

  useEffect(() => {
    if (selectedLocation) {
      const marker = document.querySelector(
        `[data-location-id="${selectedLocation.id}"]`
      );
      if (marker) {
        marker.click();
      }
    }
  }, [selectedLocation]);

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        attributionControl={false}
        zoomControl={false}
      >
        {geojson && (
          <GeoJSON
            data={geojson}
            style={{ color: "#6366f1", weight: 2, fillOpacity: 0.08 }}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const name = feature.properties.NAMOBJ || "Wilayah Cimahi";
                const rw = feature.properties.RW
                  ? `<div class='text-xs text-gray-500 mt-1'><span class='font-semibold text-gray-700'>${feature.properties.RW}</span></div>`
                  : "";
                layer.bindPopup(`
                  <div style='min-width:160px; border-radius:0.75rem; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.08); padding:16px;'>
                    <div style='font-size:1rem; font-weight:600; color:#6366f1; margin-bottom:4px;'>${name}</div>
                    ${rw}
                  </div>
                `);
              } else {
                layer.bindPopup(
                  `<div style='min-width:120px'>Wilayah Cimahi</div>`
                );
              }
            }}
          />
        )}
        <ZoomControl position="topleft" />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelit">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="TPS Aman">
            <LayerGroup>
              {markerCoordinates
                .filter((loc) => loc.status === "aman" || loc.status === "safe")
                .map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={createStatusIcon("aman")}
                    eventHandlers={{
                      click: () => onLocationSelect(location),
                    }}
                    data-location-id={location.id}
                  >
                    <Popup>
                      <div className="p-3 min-w-[220px] rounded-xl shadow-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                            TPS {location.no_tps}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold
                          ${
                            location.status === "butuh bantuan" ||
                            location.status === "needs help"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }
                          ${
                            location.status === "aman" ||
                            location.status === "safe"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                          ${
                            location.status === "sudah ditangani"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }
                        `}
                          >
                            {location.status === "butuh bantuan" ||
                            location.status === "needs help"
                              ? "Butuh Bantuan"
                              : location.status === "aman" ||
                                location.status === "safe"
                              ? "Aman"
                              : location.status === "sudah ditangani"
                              ? "Sudah Ditangani"
                              : location.status}
                          </span>
                        </div>
                        <div className="mb-1 text-sm text-gray-800 font-medium flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {location.kec}, {location.desa}
                        </div>
                        <div className="mb-1 text-xs text-gray-500">
                          Alamat: {location.alamat}
                        </div>
                        {location.status === "butuh bantuan" ||
                        location.status === "needs help" ? (
                          <>
                            {location.jenis_bencana && (
                              <div className="mt-2 text-xs text-red-700 bg-red-50 rounded px-2 py-1 font-medium">
                                {location.jenis_bencana}
                              </div>
                            )}
                            {location.keterangan && (
                              <div className="mt-1 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                                {location.keterangan}
                              </div>
                            )}
                          </>
                        ) : null}
                        {location.status === "sudah ditangani" &&
                          location.update_admin && (
                            <div className="mt-2 text-xs text-blue-700 bg-blue-50 rounded px-2 py-1">
                              Bantuan dikirim oleh: {location.update_admin}
                            </div>
                          )}
                        <div className="mt-3 flex flex-col gap-1">
                          <div className="text-xs text-gray-400">
                            Dilaporkan oleh:{" "}
                            <span className="text-gray-600">
                              {location.updated_by}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Update terakhir:{" "}
                            <span className="text-gray-600">
                              {location.updated_at
                                ? new Date(location.updated_at).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="TPS Butuh Bantuan">
            <LayerGroup>
              {markerCoordinates
                .filter(
                  (loc) =>
                    loc.status === "butuh bantuan" ||
                    loc.status === "needs help"
                )
                .map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={createStatusIcon("butuh bantuan")}
                    eventHandlers={{
                      click: () => onLocationSelect(location),
                    }}
                    data-location-id={location.id}
                  >
                    <Popup>
                      <div className="p-3 min-w-[220px] rounded-xl shadow-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                            TPS {location.no_tps}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold
                          ${
                            location.status === "butuh bantuan" ||
                            location.status === "needs help"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }
                          ${
                            location.status === "aman" ||
                            location.status === "safe"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                          ${
                            location.status === "sudah ditangani"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }
                        `}
                          >
                            {location.status === "butuh bantuan" ||
                            location.status === "needs help"
                              ? "Butuh Bantuan"
                              : location.status === "aman" ||
                                location.status === "safe"
                              ? "Aman"
                              : location.status === "sudah ditangani"
                              ? "Sudah Ditangani"
                              : location.status}
                          </span>
                        </div>
                        <div className="mb-1 text-sm text-gray-800 font-medium flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {location.kec}, {location.desa}
                        </div>
                        <div className="mb-1 text-xs text-gray-500">
                          Alamat: {location.alamat}
                        </div>
                        {location.status === "butuh bantuan" ||
                        location.status === "needs help" ? (
                          <>
                            {location.jenis_bencana && (
                              <div className="mt-2 text-xs text-red-700 bg-red-50 rounded px-2 py-1 font-medium">
                                {location.jenis_bencana}
                              </div>
                            )}
                            {location.keterangan && (
                              <div className="mt-1 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                                {location.keterangan}
                              </div>
                            )}
                          </>
                        ) : null}
                        {location.status === "sudah ditangani" &&
                          location.update_admin && (
                            <div className="mt-2 text-xs text-blue-700 bg-blue-50 rounded px-2 py-1">
                              Bantuan dikirim oleh: {location.update_admin}
                            </div>
                          )}
                        <div className="mt-3 flex flex-col gap-1">
                          <div className="text-xs text-gray-400">
                            Dilaporkan oleh:{" "}
                            <span className="text-gray-600">
                              {location.updated_by}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Update terakhir:{" "}
                            <span className="text-gray-600">
                              {location.updated_at
                                ? new Date(location.updated_at).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="TPS Sudah Ditangani">
            <LayerGroup>
              {markerCoordinates
                .filter((loc) => loc.status === "sudah ditangani")
                .map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={createStatusIcon("sudah ditangani")}
                    eventHandlers={{
                      click: () => onLocationSelect(location),
                    }}
                    data-location-id={location.id}
                  >
                    <Popup>
                      <div className="p-3 min-w-[220px] rounded-xl shadow-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                            TPS {location.no_tps}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold
                          ${
                            location.status === "butuh bantuan" ||
                            location.status === "needs help"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }
                          ${
                            location.status === "aman" ||
                            location.status === "safe"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                          ${
                            location.status === "sudah ditangani"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }
                        `}
                          >
                            {location.status === "butuh bantuan" ||
                            location.status === "needs help"
                              ? "Butuh Bantuan"
                              : location.status === "aman" ||
                                location.status === "safe"
                              ? "Aman"
                              : location.status === "sudah ditangani"
                              ? "Sudah Ditangani"
                              : location.status}
                          </span>
                        </div>
                        <div className="mb-1 text-sm text-gray-800 font-medium flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {location.kec}, {location.desa}
                        </div>
                        <div className="mb-1 text-xs text-gray-500">
                          Alamat: {location.alamat}
                        </div>
                        {location.status === "butuh bantuan" ||
                        location.status === "needs help" ? (
                          <>
                            {location.jenis_bencana && (
                              <div className="mt-2 text-xs text-red-700 bg-red-50 rounded px-2 py-1 font-medium">
                                {location.jenis_bencana}
                              </div>
                            )}
                            {location.keterangan && (
                              <div className="mt-1 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                                {location.keterangan}
                              </div>
                            )}
                          </>
                        ) : null}
                        {location.status === "sudah ditangani" &&
                          location.update_admin && (
                            <div className="mt-2 text-xs text-blue-700 bg-blue-50 rounded px-2 py-1">
                              Bantuan dikirim oleh: {location.update_admin}
                            </div>
                          )}
                        <div className="mt-3 flex flex-col gap-1">
                          <div className="text-xs text-gray-400">
                            Dilaporkan oleh:{" "}
                            <span className="text-gray-600">
                              {location.updated_by}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Update terakhir:{" "}
                            <span className="text-gray-600">
                              {location.updated_at
                                ? new Date(location.updated_at).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="TPS Histori Rawan">
            <LayerGroup>
              {markerCoordinates
                .filter((loc) => loc.status_rawan === "Rawan")
                .map((location) => (
                  <Marker
                    key={location.id + "-Rawan"}
                    position={[location.lat, location.lng]}
                    icon={createStatusIcon("rawan")}
                    eventHandlers={{
                      click: () => onLocationSelect(location),
                    }}
                    data-location-id={location.id + "-Rawan"}
                  >
                    <Popup>
                      <div className="p-3 min-w-[220px] rounded-xl shadow-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                            {location.no_tps}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            Rawan
                          </span>
                        </div>
                        <div className="mb-1 text-sm text-gray-800 font-medium flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {location.kec}, {location.desa}
                        </div>
                        <div className="mb-1 text-xs text-gray-500">
                          Alamat: {location.alamat}
                        </div>
                        <div className="mt-3 flex flex-col gap-1">
                          <div className="text-xs text-gray-400">
                            Dilaporkan oleh:{" "}
                            <span className="text-gray-600">
                              {location.updated_by}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Update terakhir:{" "}
                            <span className="text-gray-600">
                              {location.updated_at
                                ? new Date(location.updated_at).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Heatmap Kerawanan">
            <LayerGroup>
              <GeoTIFFLayer url={geoTiffUrl} />
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>

        <Legend />
      </MapContainer>
    </div>
  );
}
