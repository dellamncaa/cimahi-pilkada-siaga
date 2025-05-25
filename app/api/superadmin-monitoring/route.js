import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request) {
    try {
        const tpsRef = db.collection("tps-monitoring");
        const snapshot = await tpsRef.orderBy("no_tps").get();
        const totalDocs = snapshot.size;
        const tps = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                id_tps: data.id_tps,
                kode_kec: data.kode_kec,
                kec: data.kec,
                kode_desa: data.kode_desa,
                desa: data.desa,
                no_tps: data.no_tps,
                alamat: data.alamat,
                latitude: data.latitude,
                longitude: data.longitude,
                status_rawan: data.status_rawan,
                jenis_bencana: data.jenis_bencana,
                status_monitoring: data.status_monitoring,
                keterangan: data.keterangan,
                updated_at: data.updated_at,
                updated_by: data.updated_by,
                status_admin: data.status_admin,
                update_admin: data.update_admin,
            };
        });

        return NextResponse.json({
            status: true,
            data: tps,
            pagination: {
                totalDocs,
                limit: totalDocs,
                page: 1,
                totalPages: 1,
            },
        });
    } catch (error) {
        console.error("Error fetching TPS:", error);
        return NextResponse.json({
            status: false,
            message: "Failed to fetch TPS data",
        }, { status: 500 });
    }
}