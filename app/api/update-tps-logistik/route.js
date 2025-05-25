import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { id_tps, status_logistik, updated_by, updated_at } = await request.json();

    if (!id_tps) {
      console.error('Missing id_tps:', id_tps);
      return NextResponse.json({ error: 'Missing id_tps parameter' }, { status: 400 });
    }
    if (!status_logistik || !['sudah', 'belum'].includes(status_logistik)) {
      console.error('Invalid status_logistik:', status_logistik);
      return NextResponse.json({ error: 'status_logistik must be either "sudah" or "belum"' }, { status: 400 });
    }
    if (!updated_by || updated_by.trim() === '') {
      console.error('Invalid updated_by:', updated_by);
      return NextResponse.json({ error: 'updated_by is required and must be a non-empty string' }, { status: 400 });
    }

    const tpsRef = db.collection('tps-logistik').doc(String(id_tps));
    const tpsDoc = await tpsRef.get();
    
    if (!tpsDoc.exists) {
      console.error('TPS document not found:', id_tps);
      return NextResponse.json({ error: 'TPS not found' }, { status: 404 });
    }

    const updateData = {
      status_logistik,
      updated_by: updated_by.trim(),
      updated_at: updated_at || new Date().toISOString()
    };

    console.log('Updating TPS document:', id_tps, 'with data:', updateData);
    await tpsRef.update(updateData);
    console.log('TPS update successful for ID:', id_tps);
    
    return NextResponse.json({ 
      success: true, 
      message: 'TPS updated successfully',
      updatedData: updateData
    });

  } catch (error) {
    console.error('Error updating TPS:', error);
    return NextResponse.json({ 
      error: 'Failed to update TPS', 
      details: error.message 
    }, { status: 500 });
  }
}