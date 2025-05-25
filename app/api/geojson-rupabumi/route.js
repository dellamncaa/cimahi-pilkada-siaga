import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const faskesData = JSON.parse(readFileSync('public/rupabumi/faskes.geojson', 'utf8'));
    const pemadamData = JSON.parse(readFileSync('public/rupabumi/pemadam.geojson', 'utf8'));
    const polisiData = JSON.parse(readFileSync('public/rupabumi/polisi.geojson', 'utf8'));
    const tniData = JSON.parse(readFileSync('public/rupabumi/tni.geojson', 'utf8'));

    faskesData.features = faskesData.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        layerType: 'faskes'
      }
    }));

    pemadamData.features = pemadamData.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        layerType: 'pemadam'
      }
    }));

    polisiData.features = polisiData.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        layerType: 'polisi'
      }
    }));

    tniData.features = tniData.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        layerType: 'tni'
      }
    }));

    const combinedGeoJSON = {
      type: 'FeatureCollection',
      features: [
        ...faskesData.features,
        ...pemadamData.features,
        ...polisiData.features,
        ...tniData.features
      ]
    };

    return NextResponse.json(combinedGeoJSON);
  } catch (error) {
    console.error('Error reading GeoJSON files:', error);
    return NextResponse.json(
      { error: 'Failed to load GeoJSON data' },
      { status: 500 }
    );
  }
}