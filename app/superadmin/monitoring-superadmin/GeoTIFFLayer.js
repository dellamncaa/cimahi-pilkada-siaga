import { useEffect, useRef } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import * as GeoTIFF from "geotiff";
import L from "leaflet";

export default function GeoTIFFLayer({ url }) {
  const map = useMap();
  const layerRef = useRef(null);
  const dataRef = useRef(null);
  // Handle layer removal on overlay remove event
  useMapEvent('overlayremove', (e) => {
    if (e.name === 'Heatmap Kerawanan' && layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
  });

  // Handle layer addition on overlay add event
  useMapEvent('overlayadd', async (e) => {
    if (e.name === 'Heatmap Kerawanan') {
      if (dataRef.current) {
        // Reuse existing processed data
        if (layerRef.current) {
          layerRef.current.addTo(map);
        } else {
          const imageLayer = L.imageOverlay(dataRef.current.dataUrl, dataRef.current.bounds, {
            opacity: 0.7,
            crossOrigin: true
          });
          imageLayer.addTo(map);
          layerRef.current = imageLayer;
        }
      } else {
        // Initial load
        await loadGeoTIFF();
      }
    }
  });

  const loadGeoTIFF = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch GeoTIFF: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      
      const width = image.getWidth();
      const height = image.getHeight();
      const rasters = await image.readRasters();
      const data = rasters[0];

      const bbox = image.getBoundingBox();
      const bounds = [
        [bbox[1], bbox[0]], // Southwest corner [lat, lng]
        [bbox[3], bbox[2]]  // Northeast corner [lat, lng]
      ];

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);

      // Define color ranges for vulnerability levels (0-255)
      const colorLevels = [
        { range: 64, color: { r: 222, g: 124, b: 125 } },  // DE7C7D - Lowest
        { range: 128, color: { r: 204, g: 43, b: 82 } },   // CC2B52
        { range: 192, color: { r: 175, g: 23, b: 64 } },   // AF1740
        { range: 255, color: { r: 116, g: 9, b: 56 } }     // 740938 - Highest
      ];

      // Create color mapping
      for (let i = 0; i < data.length; i++) {
        const val = Math.round(data[i]);
        
        if (val <= 0 || val > 255) {
          imageData.data[i * 4] = 255;
          imageData.data[i * 4 + 1] = 255;
          imageData.data[i * 4 + 2] = 255;
          imageData.data[i * 4 + 3] = 0;
        } else {
          let color = colorLevels[0].color;
          for (let j = 0; j < colorLevels.length; j++) {
            if (val <= colorLevels[j].range) {
              color = colorLevels[j].color;
              break;
            }
          }

          imageData.data[i * 4] = color.r;
          imageData.data[i * 4 + 1] = color.g;
          imageData.data[i * 4 + 2] = color.b;
          imageData.data[i * 4 + 3] = 180;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Store processed data for reuse
      dataRef.current = {
        dataUrl: canvas.toDataURL(),
        bounds: bounds
      };      // Create and add the initial layer if overlay control is checked
      const controlContainer = document.querySelector('.leaflet-control-layers-overlays');
      const isChecked = controlContainer?.querySelector('input[type="checkbox"]:checked + span')?.textContent.trim() === 'Heatmap Kerawanan';
      
      if (isChecked || document.querySelector('.leaflet-control-layers-overlays') === null) { // If no control exists yet, show by default
        const imageLayer = L.imageOverlay(dataRef.current.dataUrl, bounds, {
          opacity: 0.7,
          crossOrigin: true
        });
        imageLayer.addTo(map);
        layerRef.current = imageLayer;
      }

    } catch (error) {
      console.error("Error loading GeoTIFF:", error);
    }
  };

  // Load GeoTIFF when component mounts
  useEffect(() => {
    loadGeoTIFF();
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [url, map]);

  return null;
}
