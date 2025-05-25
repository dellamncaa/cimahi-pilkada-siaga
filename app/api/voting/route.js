import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request) {
  try {    const { searchParams } = new URL(request.url);
    const id_tps = searchParams.get("id_tps");
    const kode_desa = searchParams.get("kode_desa");
    if (kode_desa) {
      console.log("Fetching TPS for kode_desa:", kode_desa);
      const kodeDesaNum = parseInt(kode_desa);
      
      const tpsSnapshot = await db.collection("tps-voting").where("kode_desa", "==", kodeDesaNum).get();const tps = [];
      console.log("TPS snapshot size:", tpsSnapshot.size);
      tpsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log("TPS doc data:", data);
        tps.push({
          id_tps: doc.id,
          no_tps: data.no_tps,
          kode_desa: data.kode_desa
        });
      });
      tps.sort((a, b) => {
        const noA = parseInt(a.no_tps) || 0;
        const noB = parseInt(b.no_tps) || 0;
        return noA - noB;
      });
      return NextResponse.json({ tps });
    }
    if (!id_tps) {
      return NextResponse.json(
        { error: "TPS ID is required" },
        { status: 400 }
      );
    }

    const tpsRef = db.collection("tps-voting").doc(id_tps);
    const doc = await tpsRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        data: {
          id_tps,
          cmh_1: "0",
          cmh_2: "0",
          cmh_3: "0",
          jbr_1: "0",
          jbr_2: "0",
          jbr_3: "0",
          jbr_4: "0",
          updated_by: "",
          updated_at: "",
        },
      });
    }

    const data = doc.data();
    const paslon = data.paslon || {};
    
    const formattedData = {
      id_tps,
      cmh_1: String(paslon.cmh_1 || 0),
      cmh_2: String(paslon.cmh_2 || 0),
      cmh_3: String(paslon.cmh_3 || 0),
      jbr_1: String(paslon.jbr_1 || 0),
      jbr_2: String(paslon.jbr_2 || 0),
      jbr_3: String(paslon.jbr_3 || 0),
      jbr_4: String(paslon.jbr_4 || 0),
      updated_by: data.updated_by || "",
      updated_at: data.updated_at || "",
    };

    return NextResponse.json({ data: formattedData });

  } catch (error) {
    console.error("Error fetching voting data:", error);
    return NextResponse.json(
      { error: "Failed to fetch voting data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
    try {
      const body = await request.json();
      const {
        id_tps,
        cmh_1,
        cmh_2,
        cmh_3,
        jbr_1,
        jbr_2,
        jbr_3,
        jbr_4,
        updated_by,
        updated_at,
      } = body;
  
      if (!id_tps) {
        return NextResponse.json(
          { error: "TPS ID is required" },
          { status: 400 }
        );
      }
  
      const voteFields = { cmh_1, cmh_2, cmh_3, jbr_1, jbr_2, jbr_3, jbr_4 };
      for (const [field, value] of Object.entries(voteFields)) {
        if (isNaN(value)) {
          return NextResponse.json(
            { error: `Invalid vote count for ${field}` },
            { status: 400 }
          );
        }
      }
  
      const numericVoteFields = Object.fromEntries(
        Object.entries(voteFields).map(([key, value]) => [key, parseInt(value, 10)])
      );     
      const tpsRef = db.collection("tps-voting").doc(id_tps);
      await tpsRef.set({
        paslon: numericVoteFields,
        updated_by,
        updated_at,
      }, { merge: true });
  
      return NextResponse.json({ message: "Voting data updated successfully" });
  
    } catch (error) {
      console.error("Error updating voting data:", error);
      return NextResponse.json(
        { error: "Failed to update voting data" },
        { status: 500 }
      );
    }
  }