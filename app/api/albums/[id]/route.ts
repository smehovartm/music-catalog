import { NextRequest, NextResponse } from 'next/server';
import { albums, findAlbum, updateAlbum, deleteAlbum } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = findAlbum(id);
  if (!album) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  return NextResponse.json(album);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  
  if (body.title !== undefined && body.title.length < 2) {
    return NextResponse.json({ error: 'Название альбома должно содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.title !== undefined && body.title.length > 50) {
    return NextResponse.json({ error: 'Название альбома не может превышать 50 символов' }, { status: 422 });
  }
  if (body.genre !== undefined && body.genre.length < 2) {
    return NextResponse.json({ error: 'Жанр должен содержать минимум 2 символа' }, { status: 422 });
  }
  if (body.genre !== undefined && body.genre.length > 30) {
    return NextResponse.json({ error: 'Жанр не может превышать 30 символов' }, { status: 422 });
  }
  
  const updated = { ...albums[index], ...body, updatedAt: new Date().toISOString() };
  updateAlbum(index, updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  deleteAlbum(index);
  return NextResponse.json({ message: 'Удалено' });
}