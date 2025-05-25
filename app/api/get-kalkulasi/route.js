import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kalkulasiSnapshot = await db.collection('kalkulasi').get();
    const kalkulasiData = kalkulasiSnapshot.docs.map(doc => ({
      id: doc.id,
      tps_location: doc.id, 
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: kalkulasiData
    });
  } catch (error) {
    console.error('Error fetching kalkulasi data:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch kalkulasi data',
      error: error.message 
    }, { status: 500 });
  }
}