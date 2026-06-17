import { NextRequest, NextResponse } from 'next/server';
import { artists, addArtist } from '@/lib/store';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  
  const filtered = artists.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));
  const items = filtered.slice((page - 1) * limit, page * limit);
  
  return NextResponse.json({
    items,
    total: filtered.length,
    page,
    pages: Math.ceil(filtered.length / limit)
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (!body.name || !body.country) {
    return NextResponse.json({ error: 'Имя и страна обязательны' }, { status: 422 });
  }
  
  if (body.name.length < 2) {
    return NextResponse.json({ error: 'Имя исполнителя должно содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.name.length > 50) {
    return NextResponse.json({ error: 'Имя исполнителя не может превышать 50 символов' }, { status: 422 });
  }
  if (body.country.length < 2) {
    return NextResponse.json({ error: 'Страна должна содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.country.length > 50) {
    return NextResponse.json({ error: 'Страна не может превышать 50 символов' }, { status: 422 });
  }
  
  const newArtist = {
    id: crypto.randomUUID(),
    name: body.name,
    country: body.country,
    birthYear: body.birthYear || null,
    isActive: body.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  addArtist(newArtist);
  return NextResponse.json(newArtist, { status: 201 });
}