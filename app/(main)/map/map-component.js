"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import layerIcons from "./layerIcons";

const findNearestFacilities = (tpsCoords, geoJsonData) => {
  if (!geoJsonData || !geoJsonData.features) return {};

  const facilityTypes = ["faskes", "pemadam", "polisi", "tni"];
  const nearest = {};
  const tpsPoint = turf.point(tpsCoords);

  facilityTypes.forEach((type) => {
    const facilities = geoJsonData.features.filter(
      (f) => f.properties.layerType === type
    );
    let nearestFacility = null;
    let minDistance = Infinity;

    facilities.forEach((facility) => {
      const facilityPoint = turf.point(facility.geometry.coordinates);
      const distance = turf.distance(tpsPoint, facilityPoint, {
        units: "kilometers",
      });

      if (distance < minDistance) {
        minDistance = distance;
        nearestFacility = {
          name:
            facility.properties.NAMSPE ||
            `${type.charAt(0).toUpperCase() + type.slice(1)} Terdekat`,
          distance: minDistance,
          coordinates: facility.geometry.coordinates,
        };
      }
    });

    if (nearestFacility) {
      nearest[type] = nearestFacility;
    }
  });

  return nearest;
};

const createTpsPopupContent = (props, geoJsonData = null, tpsCoords = null) => {
  const baseContent = `
  <style>
    .popup-container {
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      max-width: 420px;
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      background: linear-gradient(135deg, #1A237E 0%, #1565C0 100%);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      position: relative;
    }

    /* Modern Custom Scrollbar */
    .popup-container::-webkit-scrollbar {
      width: 8px;
    }
    .popup-container::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      margin: 8px 0;
    }
    .popup-container::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #1A237E, #1565C0);
      border-radius: 8px;
      border: 2px solid transparent;
      background-clip: content-box;
      transition: all 0.3s ease;
    }
    .popup-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #5a6fd8, #6a44a0);
      transform: scale(1.1);
    }

    /* Firefox scrollbar */
    .popup-container {
      scrollbar-width: thin;
      scrollbar-color: #1A237E rgba(255, 255, 255, 0.1);
    }

    .popup-content {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      margin: 8px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .popup-header {
      background: linear-gradient(135deg, #1A237E 0%, #1565C0 100%);
      color: white;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .popup-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
      50% { transform: translate(-50%, -50%) rotate(180deg); }
    }

    .popup-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .popup-id {
      font-size: 16px;
      opacity: 0.9;
      position: relative;
      z-index: 1;
      font-weight: 500;
    }

    .popup-body {
      padding: 24px;
    }

    .popup-section {
      margin-bottom: 24px;
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .popup-section:nth-child(1) { animation-delay: 0.1s; }
    .popup-section:nth-child(2) { animation-delay: 0.2s; }
    .popup-section:nth-child(3) { animation-delay: 0.3s; }
    .popup-section:nth-child(4) { animation-delay: 0.4s; }
    .popup-section:nth-child(5) { animation-delay: 0.5s; }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .popup-subtitle {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 16px;
      color: #2c3e50;
      display: flex;
      align-items: center;
      position: relative;
      padding-bottom: 8px;
    }

    .popup-subtitle::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #1A237E, #1565C0);
      border-radius: 2px;
    }

    .popup-entry {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 12px 16px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;
      border-left: 4px solid transparent;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .popup-entry::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.5s;
    }

    .popup-entry:hover {
      background: rgba(102, 126, 234, 0.1);
      border-left-color: #1A237E;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .popup-entry:hover::before {
      left: 100%;
    }

    .popup-entry svg,
    .popup-entry .emoji {
      margin-right: 12px;
      flex-shrink: 0;
      font-size: 16px;
    }

    .popup-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e0e6ed, transparent);
      margin: 24px 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-left: 8px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .status-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .status-badge:hover::before {
      left: 100%;
    }

    .status-badge.active {
      background: linear-gradient(135deg, #00b894, #00cec9);
      color: white;
      box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
    }

    .status-badge.pending {
      background: linear-gradient(135deg, #fdcb6e, #e17055);
      color: white;
      box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);
    }

    .status-badge.inactive {
      background: linear-gradient(135deg, #fd79a8, #e84393);
      color: white;
      box-shadow: 0 4px 15px rgba(253, 121, 168, 0.3);
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .modern-btn {
      display: inline-flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .modern-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .modern-btn:hover::before {
      left: 100%;
    }

    .directions-btn {
      background: linear-gradient(135deg, #00b894, #00cec9);
      color: white;
    }

    .directions-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 184, 148, 0.3);
    }

    .search-facilities-btn {
      background: linear-gradient(135deg, #1A237E, #1565C0);
      color: white;
    }

    .search-facilities-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(116, 185, 255, 0.3);
    }

    .modern-btn svg {
      margin-right: 8px;
      transition: transform 0.3s ease;
    }

    .modern-btn:hover svg {
      transform: scale(1.1);
    }

    .facilities-results {
      margin-top: 20px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(116, 185, 255, 0.1), rgba(9, 132, 227, 0.1));
      border-radius: 16px;
      border: 1px solid rgba(116, 185, 255, 0.2);
      backdrop-filter: blur(10px);
      animation: slideDown 0.5s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .facilities-header {
      font-weight: 700;
      margin-bottom: 16px;
      color: #2c3e50;
      font-size: 16px;
      display: flex;
      align-items: center;
    }

    .facility-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .facility-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.95);
    }

    .facility-item:last-child {
      margin-bottom: 0;
    }

    .facility-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
      background: linear-gradient(135deg, #74b9ff, #0984e3);
      color: white;
      font-weight: bold;
      font-size: 18px;
    }

    .facility-info {
      flex: 1;
    }

    .facility-name {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .facility-distance {
      color: #636e72;
      font-size: 13px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .votes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .stat-card {
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;
      padding: 16px;
      border-left: 4px solid #1A237E;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .popup-container {
        max-width: 90vw;
        margin: 10px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .votes-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  </style>

  <div class="popup-container">
    <div class="popup-content">
      <div class="popup-header">
        <div class="popup-title">${props.no_tps}</div>
        <div class="popup-id">ID TPS: ${props.id_tps}</div>
      </div>

      <div class="popup-body">
        <div class="popup-section">
          <div class="popup-subtitle">📍 Lokasi</div>
          <div class="popup-entry">
            <svg width="18" height="18" fill="#e67e22" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
            <div>
              <div style="font-weight: 600;">${props.alamat}</div>
              <div style="color: #636e72; font-size: 13px; margin-top: 2px;">
                Desa ${props.desa}, Kec. ${props.kec}
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              props.alamat + ", " + props.desa + ", " + props.kec
            )}" target="_blank" class="modern-btn directions-btn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.71 11.29l-9-9a.996.996 0 0 0-1.41 0l-9 9a.996.996 0 0 0 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
              </svg>
              Petunjuk Arah
            </a>
            
            <button class="modern-btn search-facilities-btn" onclick="searchNearestFacilities('${
              props.id_tps
            }')">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Cari Terdekat
            </button>
          </div>
        </div>

        <div id="facilities-results-${
          props.id_tps
        }" class="facilities-results" style="display: none;">
          <div class="facilities-header">
            🏢 Fasilitas Terdekat
          </div>
          <div id="facilities-list-${props.id_tps}"></div>
        </div>

        <div class="popup-divider"></div>

        <div class="popup-section">
          <div class="popup-subtitle">🛰️ Status Sistem</div>
          <div class="popup-entry">
            <span class="emoji">📡</span>
            <div style="flex: 1;">
              <div style="font-weight: 600;">Monitoring</div>
              <span class="status-badge ${
                props.status_monitoring === "aman"
                  ? "active"
                  : props.status_monitoring === "butuh bantuan"
                  ? "pending"
                  : "inactive"
              }">
                ${props.status_monitoring}
              </span>
            </div>
          </div>
          
          <div class="popup-entry">
            <span class="emoji">📦</span>
            <div style="flex: 1;">
              <div style="font-weight: 600;">Logistik</div>
              <span class="status-badge ${
                props.status_logistik === "sudah"
                  ? "active"
                  : props.status_logistik === "belum"
                  ? "pending"
                  : "inactive"
              }">
                ${props.status_logistik}
              </span>
            </div>
          </div>
        </div>

        <div class="popup-divider"></div>

        <div class="popup-section">
          <div class="popup-subtitle">👥 Data Pemilih</div>
          <div class="stats-grid">
            <div class="popup-entry">
              <div style="margin: 0; padding: 0; background: none;">
                <span class="emoji">👨</span>
                <div>
                  <div style="font-weight: 600;">Laki-laki</div>
                  <div style="font-size: 20px; font-weight: 700; color: #1A237E;">${
                    props.dpt_l
                  }</div>
                </div>
              </div>
            </div>
            
            <div class="popup-entry">
              <div style="margin: 0; padding: 0; background: none;">
                <span class="emoji">👩</span>
                <div>
                  <div style="font-weight: 600;">Perempuan</div>
                  <div style="font-size: 20px; font-weight: 700; color: #1A237E;">${
                    props.dpt_p
                  }</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="popup-divider"></div>

        <div class="popup-section">
          <div class="popup-subtitle">🗳️ Perolehan Suara</div>
          <div style="margin-bottom: 16px; font-weight: 600; color: #2c3e50;">Cimahi:</div>
          <div class="votes-grid">
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Cimahi 1</div>
                <div style="font-size: 18px; font-weight: 700; color: #1A237E;">${
                  props.cmh_1
                }</div>
              </div>
            </div>
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Cimahi 2</div>
                <div style="font-size: 18px; font-weight: 700; color: #1A237E;">${
                  props.cmh_2
                }</div>
              </div>
            </div>
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Cimahi 3</div>
                <div style="font-size: 18px; font-weight: 700; color: #1A237E;">${
                  props.cmh_3
                }</div>
              </div>
            </div>
          </div>
          
          <div style="margin: 24px 0 16px 0; font-weight: 600; color: #2c3e50;">Jawa Barat:</div>
          <div class="votes-grid">
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Jabar 1</div>
                <div style="font-size: 18px; font-weight: 700; color: #1565C0;">${
                  props.jbr_1
                }</div>
              </div>
            </div>
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Jabar 2</div>
                <div style="font-size: 18px; font-weight: 700; color: #1565C0;">${
                  props.jbr_2
                }</div>
              </div>
            </div>
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Jabar 3</div>
                <div style="font-size: 18px; font-weight: 700; color: #1565C0;">${
                  props.jbr_3
                }</div>
              </div>
            </div>
            <div class="stat-card">
              <div style="text-align: center;">
                <div style="font-weight: 600; color: #636e72; margin-bottom: 4px;">Jabar 4</div>
                <div style="font-size: 18px; font-weight: 700; color: #1565C0;">${
                  props.jbr_4
                }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

  return baseContent;
};

// Global function to search nearest facilities (called from popup)
window.searchNearestFacilities = function (tpsId) {
  const geoJsonData = window.currentGeoJsonData;
  const tpsData = window.currentTpsData;

  // Get TPS coordinates
  const tpsFeature = tpsData?.features?.find(
    (f) => f.properties.id_tps == tpsId
  );
  if (!tpsFeature || !geoJsonData) {
    alert("Data tidak tersedia untuk mencari fasilitas terdekat");
    return;
  }

  const tpsCoords = tpsFeature.geometry.coordinates;
  const nearest = findNearestFacilities(tpsCoords, geoJsonData);

  // Display results
  const resultsDiv = document.getElementById(`facilities-results-${tpsId}`);
  const listDiv = document.getElementById(`facilities-list-${tpsId}`);

  if (Object.keys(nearest).length === 0) {
    listDiv.innerHTML =
      '<div style="text-align: center; color: #7f8c8d; font-style: italic;">Tidak ada fasilitas ditemukan</div>';
  } else {
    const facilityIcons = {
      faskes: { color: "#DC2626", icon: layerIcons.faskes, name: "Faskes" },
      pemadam: { color: "#D0D0D0", icon: layerIcons.pemadam, name: "Pemadam" },
      polisi: { color: "#FFFF00", icon: layerIcons.polisi, name: "Polisi" },
      tni: { color: "#15803D", icon: layerIcons.tni, name: "TNI" },
    };

    listDiv.innerHTML = Object.entries(nearest)
      .map(([type, facility]) => {
        const iconInfo = facilityIcons[type];
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates[1]},${facility.coordinates[0]}`;
        return `
          <div class="facility-item">
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">
              <div class="facility-icon" style="background-color: ${
                iconInfo.color
              };">
                ${iconInfo.icon}
              </div>
              <div class="facility-info">
                <div class="facility-name">${facility.name}</div>
                <div class="facility-distance">${facility.distance.toFixed(
                  2
                )} km</div>
              </div>
            </a>
          </div> 
        
      `;
      })
      .join("");
  }

  resultsDiv.style.display = "block";
};

// Custom Legend Control component
function Legend({ map }) {
  const [activeOverlays, setActiveOverlays] = useState(
    new Set(["Batas Administrasi", "TPS"])
  );

  useEffect(() => {
    if (!map) return;

    // Create legend control
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      return div;
    };

    legend.addTo(map);

    // Update legend content based on active overlays
    const updateLegend = () => {
      const legendDiv = legend.getContainer();
      let content = `
        <div style="
          min-width: 200px;
        ">
          <h4 style="margin: 0 0 12px 0; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: black; ">Legend</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
      `;

      if (activeOverlays.has("Fasilitas Kesehatan")) {
        content += `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 24px;
              height: 24px;
              background: #DC2626;
              border-radius: 50%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            ">
              ${layerIcons.faskes}
            </div>
            <span style="color: black; transform: translateY(2px);">Fasilitas Kesehatan</span>
          </div>`;
      }

      if (activeOverlays.has("Pemadam Kebakaran")) {
        content += `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 24px;
              height: 24px;
              background: #D0D0D0;
              border-radius: 50%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            ">
              ${layerIcons.pemadam}
            </div>
            <span style="color: black; transform: translateY(2px);">Pemadam Kebakaran</span>
          </div>`;
      }

      if (activeOverlays.has("Kepolisian")) {
        content += `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 24px;
              height: 24px;
              background: #FFFF00;
              border-radius: 50%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            ">
              ${layerIcons.polisi}
            </div>
            <span style="color: black; transform: translateY(2px);">Kepolisian</span>
          </div>`;
      }

      if (activeOverlays.has("TNI")) {
        content += `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 24px;
              height: 24px;
              background: #15803D;
              border-radius: 50%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            ">
              ${layerIcons.tni}
            </div>
            <span style="color: black; transform: translateY(2px);">TNI</span>
          </div>`;
      }

      if (activeOverlays.has("TPS")) {
        content += `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 24px;
              height: 24px;
              background: #1A237E;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              flex-shrink: 0;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            "></div>
            <span style="color: black; transform: translateY(2px);">TPS</span>
          </div>`;
      }

      if (activeOverlays.has("Batas Administrasi")) {
        content += `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 24px;
              height: 3px;
              background: #3388ff;
              flex-shrink: 0;
              margin-top: 2px;
            "></div>
            <span style="color: black; transform: translateY(2px);">Batas Administrasi</span>
          </div>`;
      }

      content += `
          </div>
        </div>
      `;

      legendDiv.innerHTML = content;
    };

    // Initial update
    updateLegend();

    // Listen for overlay add/remove events
    map.on("overlayadd", (e) => {
      setActiveOverlays((prev) => new Set([...prev, e.name]));
    });

    map.on("overlayremove", (e) => {
      setActiveOverlays((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.name);
        return newSet;
      });
    });

    return () => {
      map.removeControl(legend);
    };
  }, [map, activeOverlays]);

  return null;
}

// Custom Search Control component
function SearchControl({
  map,
  tpsData,
  geoJsonData,
  setFilteredTpsData,
  createTeardropIcon,
}) {
  useEffect(() => {
    if (!map) return;

    // Create search control
    const searchControl = L.control({ position: "topleft" });

    searchControl.onAdd = function () {
      const div = L.DomUtil.create("div", "search-control");
      div.innerHTML = `
        <div class="search-container" style="background: white; padding: 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 4px;">
            <input 
              type="text" 
              placeholder="Cari TPS dan Desa..." 
              class="search-input"
              style="flex: 1; color: gray;"
            />
            <button class="clear-search-btn" style="
              padding: 8px 12px; 
              border: 1px solid #ccc; 
              border-radius: 4px; 
              background: #f8f9fa; 
              cursor: pointer;
              font-size: 12px;
              color: black; 
            ">Clear</button>
          </div>
          <div class="search-results" style="display: none;"></div>
        </div>
      `;

      const searchContainer = div.querySelector(".search-container");
      const input = div.querySelector("input");
      const resultsDiv = div.querySelector(".search-results");
      const clearBtn = div.querySelector(".clear-search-btn");
      let activeMarker = null;
      let activePopup = null;

      // Function to clear active marker
      const clearActiveMarker = () => {
        if (activeMarker) {
          map.removeLayer(activeMarker);
          activeMarker = null;
        }
        if (activePopup) {
          activePopup.remove();
          activePopup = null;
        }
      };

      // Clear button functionality
      clearBtn.addEventListener("click", () => {
        clearActiveMarker();
        input.value = "";
        resultsDiv.style.display = "none";
      });

      // Listen for layer changes to remove search marker when TPS layer is turned off
      const overlayRemoveHandler = function (e) {
        if (e.name === "TPS") {
          clearActiveMarker();
          input.value = ""; // Clear search input
          resultsDiv.style.display = "none"; // Hide results
        }
      };

      map.on("overlayremove", overlayRemoveHandler);

      // Prevent map drag when interacting with the search
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      const showSearchResults = (results) => {
        if (results.length === 0) {
          resultsDiv.style.display = "none";
          return;
        }

        resultsDiv.innerHTML = results
          .map(
            (result) => `
            <div class="search-result-item" data-id="${result.properties.id_tps}">
              <strong>${result.properties.no_tps}</strong> - ${result.properties.desa}
              <div class="search-result-detail">
                ${result.properties.alamat}
              </div>
            </div>
          `
          )
          .join("");

        resultsDiv.style.display = "block";
      };

      const zoomToFeature = (feature) => {
        // Remove previous marker using the clear function
        clearActiveMarker();

        // New coordinates
        const latlng = [
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ];

        // TPS coordinates for the popup content
        const tpsCoords = feature.geometry.coordinates;

        // Force map zoom and pan to coordinates
        map.flyTo(latlng, 18, {
          animate: true,
          duration: 0.75,
        });

        const props = feature.properties;

        // Use the unified popup content function
        const popupContent = createTpsPopupContent(
          props,
          geoJsonData,
          tpsCoords
        );

        // Add new marker
        activeMarker = L.marker(latlng, {
          icon: createTeardropIcon("#1A237E"),
          searchMarker: true, // Flag to identify this as a search marker
        }).addTo(map);

        // Bind and open the popup with the unified content
        activePopup = activeMarker.bindPopup(popupContent);
        activeMarker.openPopup();

        // Store data globally for the search function
        window.currentGeoJsonData = geoJsonData;
        window.currentTpsData = tpsData;
      };

      // Add search functionality
      input.addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();

        if (!tpsData || searchValue.length < 2) {
          resultsDiv.style.display = "none";
          return;
        }

        const searchTerms = searchValue.split(" ");

        const filteredFeatures = tpsData.features.filter((feature) => {
          const props = feature.properties;
          const tpsString = props.no_tps.toString().toLowerCase();
          const desa = props.desa.toLowerCase();
          const alamat = props.alamat.toLowerCase();

          return searchTerms.every(
            (term) =>
              tpsString.includes(term) ||
              desa.includes(term) ||
              alamat.includes(term)
          );
        });

        showSearchResults(filteredFeatures.slice(0, 5)); // Show top 5 results
      });

      // Handle click on search results
      resultsDiv.addEventListener("click", (e) => {
        const resultItem = e.target.closest(".search-result-item");
        if (!resultItem) return;

        const id = resultItem.dataset.id;
        const feature = tpsData.features.find((f) => f.properties.id_tps == id);

        if (!feature) return;

        // Zoom to the selected feature
        zoomToFeature(feature);
        resultsDiv.style.display = "none";
        input.value = `${feature.properties.no_tps} - ${feature.properties.desa}`;
      });

      // Close results when clicking outside
      document.addEventListener("click", (e) => {
        if (!searchContainer.contains(e.target)) {
          resultsDiv.style.display = "none";
        }
      });

      return div;
    };

    searchControl.addTo(map);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, tpsData, setFilteredTpsData]);

  return null;
}

export default function MapComponent() {
  const [map, setMap] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [boundaryData, setBoundaryData] = useState(null);
  const [tpsData, setTpsData] = useState(null);
  const [filteredTpsData, setFilteredTpsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch points data
        const response = await fetch("/api/geojson-rupabumi");
        const data = await response.json();
        setGeoJsonData(data);

        // Fetch TPS data
        const tpsResponse = await fetch("/api/get-point-map");
        const tpsData = await tpsResponse.json();
        setTpsData(tpsData);
        setFilteredTpsData(tpsData); // Initialize filtered data with all TPS

        // Fetch boundary data
        const boundaryResponse = await fetch("/cimahi.geojson");
        const boundaryData = await boundaryResponse.json();
        setBoundaryData(boundaryData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Create teardrop icon for TPS points
  const createTeardropIcon = (color) => {
    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 30px;
          height: 40px;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 24px;
            background: ${color};
            border-radius: 50% 50% 50% 0;
            transform-origin: center;
            transform: translateX(-50%) rotate(-45deg);
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
          "></div>
        </div>
      `,
      className: "custom-div-icon",
      iconSize: [30, 40],
      iconAnchor: [15, 40], // Point of the teardrop
      popupAnchor: [0, -40], // Popup appears above the point
    });
  };

  // Function to create custom cluster icon
  const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: L.point(40, 40, true),
    });
  };

  // Function to create custom divIcon with SVG
  const createCustomIcon = (layerType, color) => {
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${layerIcons[layerType] || ""}
        </div>
      `,
      className: "custom-div-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  // Function to style points based on their layer type and status
  const pointToLayer = (feature, latlng) => {
    const markerColor = {
      faskes: "#DC2626", // red
      pemadam: "#D0D0D0", // grey
      polisi: "#FFFF00", // yellow
      tni: "#15803D", // green
      tps: "#1A237E",
    };

    const color = markerColor[feature.properties.layerType];

    if (feature.properties.layerType === "tps") {
      return L.marker(latlng, {
        icon: createTeardropIcon(color),
      });
    }

    return L.marker(latlng, {
      icon: createCustomIcon(feature.properties.layerType, color),
    });
  };

  // Style for the boundary
  const boundaryStyle = {
    fillColor: "#3388ff",
    fillOpacity: 0.1,
    color: "#3388ff",
    weight: 2,
    dashArray: "5, 5",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin mb-4 rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pt-16">
      <style jsx global>{`
        .custom-marker-cluster {
          background: #1a237e;
          border-radius: 50%;
          color: white;
          height: 40px;
          width: 40px;
          line-height: 40px;
          text-align: center;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .legend {
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .search-container {
          position: relative;
          z-index: 1000;
        }

        .search-input {
          width: 200px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .clear-search-btn:hover {
          background-color: #e9ecef !important;
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          max-height: 300px;
          overflow-y: auto;
        }

        .search-result-item {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }

        .search-result-item:hover {
          background-color: #f5f5f5;
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-detail {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }
      `}</style>

      <MapContainer
        center={[-6.881971923738381, 107.54226514819118]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={setMap}
      >
        {/* Add Search Control */}
        {map && (
          <SearchControl
            map={map}
            tpsData={tpsData}
            geoJsonData={geoJsonData}
            position="topleft"
            setFilteredTpsData={setFilteredTpsData}
            createTeardropIcon={createTeardropIcon}
          />
        )}

        <ZoomControl position="bottomleft" />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution="&copy; Google"
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>

          {geoJsonData && (
            <>
              <LayersControl.Overlay name="Fasilitas Kesehatan">
                <GeoJSON
                  data={{
                    type: "FeatureCollection",
                    features: geoJsonData.features.filter(
                      (f) => f.properties.layerType === "faskes"
                    ),
                  }}
                  pointToLayer={pointToLayer}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(
                      feature.properties.NAMSPE || "Fasilitas Kesehatan"
                    );
                  }}
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Pemadam Kebakaran">
                <GeoJSON
                  data={{
                    type: "FeatureCollection",
                    features: geoJsonData.features.filter(
                      (f) => f.properties.layerType === "pemadam"
                    ),
                  }}
                  pointToLayer={pointToLayer}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(
                      feature.properties.NAMSPE || "Pemadam Kebakaran"
                    );
                  }}
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Kepolisian">
                <GeoJSON
                  data={{
                    type: "FeatureCollection",
                    features: geoJsonData.features.filter(
                      (f) => f.properties.layerType === "polisi"
                    ),
                  }}
                  pointToLayer={pointToLayer}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(feature.properties.NAMSPE || "Kepolisian");
                  }}
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="TNI">
                <GeoJSON
                  data={{
                    type: "FeatureCollection",
                    features: geoJsonData.features.filter(
                      (f) => f.properties.layerType === "tni"
                    ),
                  }}
                  pointToLayer={pointToLayer}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(feature.properties.NAMSPE || "TNI");
                  }}
                />
              </LayersControl.Overlay>
            </>
          )}

          {/* Add TPS points with clustering */}
          {filteredTpsData && (
            <LayersControl.Overlay checked name="TPS">
              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
              >
                {filteredTpsData.features.map((feature) => (
                  <GeoJSON
                    key={feature.properties.id_tps}
                    data={feature}
                    pointToLayer={pointToLayer}
                    onEachFeature={(feature, layer) => {
                      const props = feature.properties;
                      // Use the unified popup content function
                      const popupContent = createTpsPopupContent(
                        props,
                        geoJsonData,
                        feature.geometry.coordinates
                      );
                      layer.bindPopup(popupContent);

                      // Store data globally when popup opens
                      layer.on("popupopen", () => {
                        window.currentGeoJsonData = geoJsonData;
                        window.currentTpsData = filteredTpsData;
                      });
                    }}
                  />
                ))}
              </MarkerClusterGroup>
            </LayersControl.Overlay>
          )}

          {/* Add Cimahi boundary layer */}
          {boundaryData && (
            <LayersControl.Overlay checked name="Batas Administrasi">
              <GeoJSON data={boundaryData} style={boundaryStyle} />
            </LayersControl.Overlay>
          )}
        </LayersControl>
        {/* Add Legend */}
        {map && <Legend map={map} />}
      </MapContainer>
    </div>
  );
}
