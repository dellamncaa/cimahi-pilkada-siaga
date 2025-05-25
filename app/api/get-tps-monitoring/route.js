import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const startAfter = (page - 1) * limit;
        const tpsRef = db.collection("tps-monitoring");
        const snapshot = await tpsRef
            .orderBy("no_tps")
            .offset(startAfter)
            .limit(limit)
            .select("no_tps", "desa", "kec", "status_monitoring", "update_by", "update_at")
            .get();

        const totalDocs = (await tpsRef.count().get()).data().count;

        const tps = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            status: true,
            data: tps,
            pagination: {
                totalDocs,
                limit,
                page,
                totalPages: Math.ceil(totalDocs / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching TPS:", error);
        return NextResponse.json({
            status: false,
            message: "Failed to fetch TPS data"
        }, { status: 500 });
    }
}