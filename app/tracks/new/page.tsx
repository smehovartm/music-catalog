'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';
import CharCounter from '@/app/components/CharCounter';

interface Album {
  id: string;
  title: string;
}

function NewTrackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get('albumId');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(albumId || '');
  const [audioPath, setAudioPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/albums?limit=100')
      .then(res => res.json())
      .then(data => setAlbums(data.items));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioPath) {
      setError('Загрузите аудиофайл');
      return;
    }
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, albumId: selectedAlbum, audioPath }),
    });
    
    if (res.ok) {
      router.push(`/albums/${selectedAlbum}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка при добавлении трека');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Добавить трек</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <label className="block font-medium mb-1">Название трека *</label>
            <CharCounter value={title} maxLength={50} />
          </div>
          <input
            type="text"
            required
            maxLength={50}
            className="w-full border p-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">Альбом *</label>
          <select
            required
            className="w-full border p-2 rounded"
            value={selectedAlbum}
            onChange={e => setSelectedAlbum(e.target.value)}
          >
            <option value="">Выберите альбом</option>
            {albums.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Аудиофайл *</label>
          <FileUpload type="audio" onUpload={setAudioPath} label="Загрузить MP3" />
          {audioPath && (
            <audio controls src={audioPath} className="w-full mt-2" />
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
}

export default function NewTrackPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
      <NewTrackContent />
    </Suspense>
  );
}