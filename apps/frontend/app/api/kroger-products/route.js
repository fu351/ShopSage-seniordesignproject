import { Krogers } from '../../../../backend/src/Produce_Getter/Kroger';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get('zipCode');
  const searchTerm = searchParams.get('searchTerm');
  const brand = searchParams.get('brand');

  try {
    const products = await Krogers(zipCode, searchTerm, brand);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching Kroger products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}