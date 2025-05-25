import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await db.collection('tps-logistik').get();
    const logistikData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      status: 200,
      data: logistikData,
      message: "Success fetching logistik data"
    });

  } catch (error) {
    console.error('Error fetching logistik data:', error);
    return NextResponse.json({
      status: 500,
      message: "Error fetching logistik data",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (id) {
      await db.collection('tps-logistik').doc(id).update({
        ...data,
        updated_at: new Date().toISOString()
      });

      return NextResponse.json({
        status: 200,
        message: "Logistik data updated successfully"
      });
    }

    const docRef = await db.collection('tps-logistik').add({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      status: 201,
      message: "Logistik data created successfully",
      id: docRef.id
    });

  } catch (error) {
    console.error('Error managing logistik data:', error);
    return NextResponse.json({
      status: 500,
      message: "Error managing logistik data",
      error: error.message
    }, { status: 500 });
  }
}