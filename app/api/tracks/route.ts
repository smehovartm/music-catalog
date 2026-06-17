import { NextRequest, NextResponse } from 'next/server';
import { tracks, addTrack, findAlbum } from '@/lib/store';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get('albumId');
  const filtered = albumId ? tracks.filter(t => t.albumId === albumId) : tracks;
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (!body.title || !body.albumId || !body.audioPath) {
    return NextResponse.json({ error: 'Все поля обязательны' }, { status: 422 });
  }
  if (!findAlbum(body.albumId)) {
    return NextResponse.json({ error: 'Альбом не найден' }, { status: 422 });
  }

  if (body.title.length < 2) {
    return NextResponse.json({ error: 'Название трека должно содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.title.length > 50) {
    return NextResponse.json({ error: 'Название трека не может превышать 50 символов' }, { status: 422 });
  }
  
  addTrack({
    id: crypto.randomUUID(),
    title: body.title,
    albumId: body.albumId,
    audioPath: body.audioPath,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json({ success: true }, { status: 201 });
}