import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kode_desa = searchParams.get("kode_desa");

    if (!kode_desa) {
      return NextResponse.json(
        { error: "Kode desa is required" },
        { status: 400 }
      );
    }

    const kodeDesaNum = parseInt(kode_desa);
    const tpsRef = db.collection("tps-monitoring");
    const tpsSnapshot = await tpsRef
      .where("kode_desa", "==", kodeDesaNum)
      .get();

    const tpsData = [];
    tpsSnapshot.forEach((doc) => {
      tpsData.push({
        id_tps: doc.id,  
        ...doc.data(),
      });
    });

    return NextResponse.json({ tps: tpsData });
  } catch (error) {
    console.error("Error fetching TPS data:", error);
    return NextResponse.json(
      { error: "Failed to fetch TPS data" },
      { status: 500 }
    );
  }
}