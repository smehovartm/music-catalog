import { NextRequest, NextResponse } from 'next/server';
import { artists, albums, findArtist, updateArtist, deleteArtist } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = findArtist(id);
  if (!artist) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  const artistAlbums = albums.filter(a => a.artistId === id);
  return NextResponse.json({ ...artist, albums: artistAlbums });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const index = artists.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  
  if (body.name !== undefined && body.name.length < 2) {
    return NextResponse.json({ error: 'Имя исполнителя должно содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.name !== undefined && body.name.length > 50) {
    return NextResponse.json({ error: 'Имя исполнителя не может превышать 50 символов' }, { status: 422 });
  }
  if (body.country !== undefined && body.country.length < 2) {
    return NextResponse.json({ error: 'Страна должна содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.country !== undefined && body.country.length > 50) {
    return NextResponse.json({ error: 'Страна не может превышать 50 символов' }, { status: 422 });
  }
  
  const updated = { ...artists[index], ...body, updatedAt: new Date().toISOString() };
  updateArtist(index, updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = artists.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  deleteArtist(index);
  return NextResponse.json({ message: 'Удалено' });
}