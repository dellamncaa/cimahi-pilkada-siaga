// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl, useMap } from 'react-leaflet';

// const MapComponent = ({ 
//   poskoPoints = [], 
//   analyzedTpsPoints = [], 
//   onMarkerAdded, 
//   deletePosko, 
//   setMap 
// }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Draw Control Hook Component
//   const DrawControlHook = ({ onMarkerAdded }) => {
//     const map = useMap();
//     const drawControlRef = useRef(null);
//     const drawnItemsRef = useRef(null);

//     useEffect(() => {
//       if (!map || !isClient) return;

//       const initDrawControl = async () => {
//         try {
//           // Import Leaflet first
//           const L = (await import('leaflet')).default;
          
//           // Import Leaflet Draw
//           await import('leaflet-draw');
          
//           // Import CSS
//           await import('leaflet/dist/leaflet.css');
//           await import('leaflet-draw/dist/leaflet.draw.css');

//           // Make sure L is available globally for leaflet-draw
//           if (typeof window !== 'undefined') {
//             window.L = L;
//           }

//           // Fix default markers
//           if (L.Icon && L.Icon.Default) {
//             delete L.Icon.Default.prototype._getIconUrl;
//             L.Icon.Default.mergeOptions({
//               iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//               iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//               shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//             });
//           }

//           // Create a feature group to store drawn items
//           const drawnItems = new L.FeatureGroup();
//           map.addLayer(drawnItems);
//           drawnItemsRef.current = drawnItems;

//           // Create draw control
//           const drawControl = new L.Control.Draw({
//             draw: {
//               marker: true,
//               polyline: false,
//               polygon: false,
//               rectangle: false,
//               circle: false,
//               circlemarker: false
//             },
//             edit: {
//               featureGroup: drawnItems,
//               remove: false
//             }
//           });

//           map.addControl(drawControl);
//           drawControlRef.current = drawControl;

//           // Handle draw events
//           const handleDrawCreated = (e) => {
//             const { layerType, layer } = e;
            
//             if (layerType === 'marker') {
//               const latlng = layer.getLatLng();
//               if (onMarkerAdded) {
//                 onMarkerAdded(latlng);
//               }
//               // Don't add the temporary marker to the map
//               // since we'll create our own custom marker
//             }
//           };

//           // Use string event name instead of L.Draw.Event constant
//           map.on('draw:created', handleDrawCreated);

//           return () => {
//             map.off('draw:created', handleDrawCreated);
//           };

//         } catch (error) {
//           console.error('Error initializing draw control:', error);
//         }
//       };

//       const cleanup = initDrawControl();

//       return () => {
//         if (drawControlRef.current) {
//           try {
//             map.removeControl(drawControlRef.current);
//           } catch (e) {
//             console.error('Error removing draw control:', e);
//           }
//         }
//         if (drawnItemsRef.current) {
//           try {
//             map.removeLayer(drawnItemsRef.current);
//           } catch (e) {
//             console.error('Error removing drawn items layer:', e);
//           }
//         }
//         if (cleanup) {
//           cleanup.then(cleanupFn => cleanupFn && cleanupFn());
//         }
//       };
//     }, [map, onMarkerAdded]);

//     return null;
//   };

//   // Custom icons for different marker types
//   const createCustomIcon = (color) => {
//     if (!isClient || typeof window === 'undefined') return null;
    
//     try {
//       // Use global L if available, otherwise try to import
//       const L = window.L || require('leaflet');
      
//       const iconSvg = `
//         <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
//           <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#000" stroke-width="1"/>
//           <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
//         </svg>
//       `;
      
//       return L.divIcon({
//         html: iconSvg,
//         className: 'custom-marker-icon',
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34]
//       });
//     } catch (error) {
//       console.error('Error creating custom icon:', error);
//       return null;
//     }
//   };

//   const handleMapCreation = (map) => {
//     if (setMap) {
//       setMap(map);
//     }
    
//     // Force map to resize after creation
//     setTimeout(() => {
//       map.invalidateSize();
//     }, 100);
//   };

//   if (!isClient) {
//     return <div style={{ height: '100%', width: '100%', background: '#f0f0f0' }}>Loading map...</div>;
//   }

//   return (
//     <>
//       <style jsx global>{`
//         .custom-marker-icon {
//           background: none !important;
//           border: none !important;
//         }
//         .leaflet-draw-toolbar a {
//           background-image: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/images/spritesheet.png') !important;
//         }
//         .leaflet-draw-toolbar a.leaflet-draw-draw-marker {
//           background-position: -2px -2px !important;
//         }
//       `}</style>
      
//       <div style={{ height: '100%', width: '100%' }}>
//         <MapContainer
//           center={[-6.2088, 106.8456]}
//           zoom={12}
//           zoomControl={false}
//           style={{ height: '100%', width: '100%', minHeight: '100vh' }}
//           whenCreated={handleMapCreation}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />

//           <ZoomControl position="bottomleft" />

//           {/* Draw Control */}
//           {onMarkerAdded && <DrawControlHook onMarkerAdded={onMarkerAdded} />}

//           {/* Posko Markers */}
//           {poskoPoints.map(posko => (
//             <React.Fragment key={posko.id}>
//               <Marker
//                 position={[posko.lat, posko.lng]}
//                 icon={createCustomIcon('#3B82F6')}
//               >
//                 <Popup>
//                   <div className="text-center">
//                     <h4 className="font-semibold">Security Post</h4>
//                     <p className="text-sm">Buffer: {posko.bufferDistance}km</p>
//                     <button
//                       onClick={() => deletePosko(posko.id)}
//                       className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </Popup>
//               </Marker>
              
//               {/* Buffer Circle */}
//               <Circle
//                 center={[posko.lat, posko.lng]}
//                 radius={posko.bufferDistance * 1000}
//                 fillColor="#3B82F6"
//                 fillOpacity={0.1}
//                 color="#3B82F6"
//                 weight={2}
//               />
//             </React.Fragment>
//           ))}

//           {/* TPS Markers */}
//           {analyzedTpsPoints.map(tps => (
//             <Marker
//               key={tps.id}
//               position={[tps.lat, tps.lng]}
//               icon={createCustomIcon(tps.isInside ? '#10B981' : '#EF4444')}
//             >
//               <Popup>
//                 <div>
//                   <h4 className="font-semibold">TPS Point</h4>
//                   <p className="text-sm">
//                     Status: {tps.isInside ? 'Inside Buffer' : 'Outside Buffer'}
//                   </p>
//                   {tps.name && <p className="text-sm">Name: {tps.name}</p>}
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>
//     </>
//   );
// };

// export default MapComponent;