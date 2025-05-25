import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const monitoringSnapshot = await db.collection("tps-monitoring").get();
    const tpsDataMap = new Map();

    for (const doc of monitoringSnapshot.docs) {
      const monitoringData = doc.data();
      tpsDataMap.set(doc.id, {
        id_tps: doc.id,
        no_tps: monitoringData.no_tps,
        alamat: monitoringData.alamat,
        desa: monitoringData.desa,
        kec: monitoringData.kec,
        latitude: monitoringData.latitude,
        longitude: monitoringData.longitude,
        status_monitoring:
          monitoringData.status_monitoring || "Belum dimonitor",
        status_logistik: "Belum ada data", 
        cmh_1: 0,
        cmh_2: 0,
        cmh_3: 0,
        jbr_1: 0,
        jbr_2: 0,
        jbr_3: 0,
        jbr_4: 0,
        dpt_l: 0,
        dpt_p: 0,
      });
    }

    const logistikSnapshot = await db.collection("tps-logistik").get();
    for (const doc of logistikSnapshot.docs) {
      const logistikData = doc.data();
      if (tpsDataMap.has(doc.id)) {
        tpsDataMap.get(doc.id).status_logistik =
          logistikData.status_logistik || "Belum ada data";
      }
    }    
    const votingSnapshot = await db.collection("tps-voting").get();
    for (const doc of votingSnapshot.docs) {
      const votingData = doc.data();
      console.log('Raw voting data for TPS', doc.id, ':', votingData); 
      
      if (tpsDataMap.has(doc.id)) {
        const tpsData = tpsDataMap.get(doc.id);
        const paslonData = votingData.paslon || {};
        console.log('Paslon data:', paslonData); 

        Object.assign(tpsData, {
          cmh_1: parseInt(paslonData.cmh_1) || 0,
          cmh_2: parseInt(paslonData.cmh_2) || 0,
          cmh_3: parseInt(paslonData.cmh_3) || 0,
          jbr_1: parseInt(paslonData.jbr_1) || 0,
          jbr_2: parseInt(paslonData.jbr_2) || 0,
          jbr_3: parseInt(paslonData.jbr_3) || 0,
          jbr_4: parseInt(paslonData.jbr_4) || 0,
          dpt_l: votingData.dpt_l || 0,
          dpt_p: votingData.dpt_p || 0,
        });
      }
    }

    const features = Array.from(tpsDataMap.values()).map((data) => ({
      type: "Feature",
      properties: {
        id_tps: data.id_tps,
        no_tps: data.no_tps,
        alamat: data.alamat,
        desa: data.desa,
        kec: data.kec,
        status_monitoring: data.status_monitoring,
        status_logistik: data.status_logistik,
        cmh_1: data.cmh_1,
        cmh_2: data.cmh_2,
        cmh_3: data.cmh_3,
        jbr_1: data.jbr_1,
        jbr_2: data.jbr_2,
        jbr_3: data.jbr_3,
        jbr_4: data.jbr_4,
        dpt_l: data.dpt_l,
        dpt_p: data.dpt_p,
        layerType: "tps",
      },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
      },
    }));

    const geoJson = {
      type: "FeatureCollection",
      features: features,
    };

    return NextResponse.json(geoJson);
  } catch (error) {
    console.error("Error fetching TPS data:", error);
    return NextResponse.json(
      { error: "Failed to fetch TPS data" },
      { status: 500 }
    );
  }
}
