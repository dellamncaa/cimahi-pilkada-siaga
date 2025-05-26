// 'use client';

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import * as turf from '@turf/turf';

// // Dynamically import the map component to avoid SSR issues
// const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

// // Modal Component
// const BufferModal = ({ isOpen, onClose, onConfirm, loading }) => {
//   const [bufferDistance, setBufferDistance] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const distance = parseFloat(bufferDistance);
//     if (!isNaN(distance) && distance > 0) {
//       onConfirm(distance);
//       setBufferDistance('');
//     } else {
//       alert('Please enter a valid distance greater than 0');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
//         <h3 className="text-lg font-semibold mb-4">Set Buffer Distance</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Buffer Distance (kilometers)
//             </label>
//             <input
//               type="number"
//               step="0.1"
//               min="0.1"
//               value={bufferDistance}
//               onChange={(e) => setBufferDistance(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g., 2.5"
//               disabled={loading}
//               required
//             />
//           </div>
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => {
//                 onClose();
//                 setBufferDistance('');
//               }}
//               className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Processing...' : 'Create Buffer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const SuperadminAnalisis = () => {
//   const [map, setMap] = useState(null);
//   const [poskoPoints, setPoskoPoints] = useState([]);
//   const [tpsPoints, setTpsPoints] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [pendingPosko, setPendingPosko] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [tpsLoading, setTpsLoading] = useState(false);

//   // Fetch TPS data
//   const fetchTpsData = async () => {
//     setTpsLoading(true);
//     try {
//       const response = await fetch('/api/get-point-map');
//       if (!response.ok) throw new Error('Failed to fetch TPS data');
      
//       const data = await response.json();
      
//       // Handle different response formats
//       let points = [];
//       if (data.type === 'FeatureCollection') {
//         // GeoJSON format
//         points = data.features.map(feature => ({
//           id: feature.properties.id || Math.random(),
//           lat: feature.geometry.coordinates[1],
//           lng: feature.geometry.coordinates[0],
//           ...feature.properties
//         }));
//       } else if (Array.isArray(data)) {
//         // Array of coordinates format
//         points = data.map((point, index) => ({
//           id: point.id || index,
//           lat: point.lat || point[1],
//           lng: point.lng || point[0],
//           ...point
//         }));
//       }
      
//       setTpsPoints(points);
//     } catch (error) {
//       console.error('Error fetching TPS data:', error);
//       alert('Failed to fetch TPS data. Please try again.');
//     } finally {
//       setTpsLoading(false);
//     }
//   };

//   // Load TPS data on component mount
//   useEffect(() => {
//     fetchTpsData();
//   }, []);

//   // Handle posko marker addition
//   const handleMarkerAdded = (latlng) => {
//     setPendingPosko(latlng);
//     setModalOpen(true);
//   };

//   // Create buffer and analyze TPS points
//   const handleBufferConfirm = async (bufferDistance) => {
//     if (!pendingPosko) return;

//     setLoading(true);
//     try {
//       // Create buffer around posko point
//       const centerPoint = turf.point([pendingPosko.lng, pendingPosko.lat]);
//       const buffered = turf.buffer(centerPoint, bufferDistance, { units: 'kilometers' });
      
//       // Analyze TPS points
//       const analyzedTps = tpsPoints.map(tps => {
//         const tpsPoint = turf.point([tps.lng, tps.lat]);
//         const isInside = turf.booleanPointInPolygon(tpsPoint, buffered);
//         return {
//           ...tps,
//           isInside,
//           poskoId: Date.now() // Associate with this posko
//         };
//       });

//       // Create new posko point
//       const newPosko = {
//         id: Date.now(),
//         lat: pendingPosko.lat,
//         lng: pendingPosko.lng,
//         bufferDistance,
//         buffer: buffered,
//         tpsAnalysis: analyzedTps
//       };

//       setPoskoPoints(prev => [...prev, newPosko]);
//       setModalOpen(false);
//       setPendingPosko(null);
//     } catch (error) {
//       console.error('Error creating buffer:', error);
//       alert('Error creating buffer analysis. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete specific posko
//   const deletePosko = (poskoId) => {
//     setPoskoPoints(prev => prev.filter(p => p.id !== poskoId));
//   };

//   // Clear all posko points
//   const clearAll = () => {
//     setPoskoPoints([]);
//   };

//   // Get TPS points with their analysis status
//   const getAnalyzedTpsPoints = () => {
//     if (poskoPoints.length === 0) {
//       return tpsPoints.map(tps => ({ ...tps, isInside: false }));
//     }

//     return tpsPoints.map(tps => {
//       // Check if this TPS is inside any buffer
//       const isInside = poskoPoints.some(posko => {
//         const tpsPoint = turf.point([tps.lng, tps.lat]);
//         return turf.booleanPointInPolygon(tpsPoint, posko.buffer);
//       });
      
//       return { ...tps, isInside };
//     });
//   };

//   const analyzedTpsPoints = getAnalyzedTpsPoints();

//   return (
//     <div className="h-screen w-full relative">
//       {/* Loading overlay */}
//       {tpsLoading && (
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
//           <div className="bg-white p-4 rounded-lg">
//             <div className="text-center">Loading TPS data...</div>
//           </div>
//         </div>
//       )}

//       {/* Control Panel */}
//       <div className="absolute top-50 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
//         <h3 className="font-semibold mb-3">Analysis Control</h3>
//         <div className="space-y-2">
//           <div className="text-sm text-gray-600">
//             Posko Points: {poskoPoints.length}
//           </div>
//           <div className="text-sm text-gray-600">
//             TPS Points: {tpsPoints.length}
//           </div>
//           <div className="text-sm">
//             <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
//             Inside Buffer: {analyzedTpsPoints.filter(t => t.isInside).length}
//           </div>
//           <div className="text-sm">
//             <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
//             Outside Buffer: {analyzedTpsPoints.filter(t => !t.isInside).length}
//           </div>
//           <button
//             onClick={clearAll}
//             className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
//             disabled={poskoPoints.length === 0}
//           >
//             Clear All Posko
//           </button>
//         </div>
//       </div>

//       {/* Instructions */}
//       <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-sm">
//         <h3 className="font-semibold mb-2">Instructions</h3>
//         <ul className="text-sm text-gray-600 space-y-1">
//           <li>• Click the marker tool in the top-left corner</li>
//           <li>• Click on the map to add a security post (posko)</li>
//           <li>• Set buffer distance when prompted</li>
//           <li>• View TPS analysis results in green/red</li>
//         </ul>
//       </div>

//       {/* Map */}
//       <MapComponent
//         poskoPoints={poskoPoints}
//         analyzedTpsPoints={analyzedTpsPoints}
//         onMarkerAdded={handleMarkerAdded}
//         deletePosko={deletePosko}
//         setMap={setMap}
//       />

//       {/* Buffer Distance Modal */}
//       <BufferModal
//         isOpen={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setPendingPosko(null);
//         }}
//         onConfirm={handleBufferConfirm}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default SuperadminAnalisis;