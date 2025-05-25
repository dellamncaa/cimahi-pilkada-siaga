import admin from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = admin.firestore();
    const testRef = await db.collection('test').doc('connection').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'connected'
    });

    return NextResponse.json({ 
      status: 'success',
      message: 'Firebase Admin SDK is connected successfully!'
    });
  } catch (error) {
    console.error('Firebase connection error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error.message 
    }, { status: 500 });
  }
}