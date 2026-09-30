import { NextResponse } from 'next/server';
import { PILOT_BASINS } from '@/lib/pilotBasins';
import { generateFhirBundle } from '@/lib/fhirGenerator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const basinId = searchParams.get('basinId') || 'toulouse-canal';

  const basin = PILOT_BASINS.find((b) => b.id === basinId) || PILOT_BASINS[0];
  const fhirBundle = generateFhirBundle(basin);

  return NextResponse.json(fhirBundle, {
    headers: {
      'Content-Type': 'application/fhir+json',
      'X-Standards-Compliance': 'HL7-FHIR-R4; LOINC; ICD-10',
    },
  });
}
