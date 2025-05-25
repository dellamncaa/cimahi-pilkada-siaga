import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(request) {
  const { id_tps, status_admin, update_admin } = await request.json();
  try {
    await db.collection("tps-monitoring").doc(id_tps).update({
      status_admin,
      update_admin,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
