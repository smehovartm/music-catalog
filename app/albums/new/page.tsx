'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';
import CharCounter from '@/app/components/CharCounter';

interface Artist {
  id: string;
  name: string;
}

function NewAlbumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState({
    title: '',
    releaseYear: new Date().getFullYear(),
    genre: '',
    artistId: searchParams.get('artistId') || '',
    isStudio: true,
  });
  const [coverPath, setCoverPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/artists?limit=100')
      .then(res => res.json())
      .then(data => setArtists(data.items));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, releaseYear: Number(form.releaseYear), coverPath: coverPath || null }),
    });
    if (res.ok) router.push('/albums');
    else { const data = await res.json(); setError(data.error); setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Новый альбом</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <label className="block font-medium">Название *</label>
            <CharCounter value={form.title} maxLength={50} />
          </div>
          <input
            type="text"
            required
            maxLength={50}
            className="w-full border p-2 rounded mt-1"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-medium">Год выпуска *</label>
          <input
            type="number"
            required
            className="w-full border p-2 rounded mt-1"
            value={form.releaseYear}
            onChange={e => setForm({...form, releaseYear: Number(e.target.value)})}
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="block font-medium">Жанр *</label>
            <CharCounter value={form.genre} maxLength={30} />
          </div>
          <input
            type="text"
            required
            maxLength={30}
            className="w-full border p-2 rounded mt-1"
            value={form.genre}
            onChange={e => setForm({...form, genre: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-medium">Исполнитель *</label>
          <select
            required
            className="w-full border p-2 rounded mt-1"
            value={form.artistId}
            onChange={e => setForm({...form, artistId: e.target.value})}
          >
            <option value="">Выберите</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Обложка</label>
          <FileUpload type="cover" onUpload={setCoverPath} label="Загрузить обложку" />
          {coverPath && <img src={coverPath} alt="Обложка" className="w-24 h-24 object-cover rounded mt-2" />}
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isStudio}
              onChange={e => setForm({...form, isStudio: e.target.checked})}
            />
            Студийный альбом
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>
    </div>
  );
}

export default function NewAlbumPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
      <NewAlbumContent />
    </Suspense>
  );
}