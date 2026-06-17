'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../components/ActionButton';

interface Album {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  isStudio: boolean;
  coverPath: string | null;
}

interface Artist {
  id: string;
  name: string;
  country: string;
  birthYear: number | null;
  isActive: boolean;
  albums: Album[];
}

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArtist = async () => {
    try {
      const res = await fetch(`/api/artists/${params.id}`);
      if (!res.ok) throw new Error('Не найден');
      const data = await res.json();
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtist();
  }, [params.id]);

  const handleDeleteArtist = async () => {
    const res = await fetch(`/api/artists/${params.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/artists');
    else alert('Ошибка');
  };

  const deleteAlbum = async (albumId: string) => {
    await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
    loadArtist();
  };

  const editArtist = async () => {
    router.push(`/artists/${artist?.id}/edit`);
  };

  const editAlbum = async (albumId: string) => {
    router.push(`/albums/${albumId}/edit`);
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!artist) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white relative overflow-hidden rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold truncate">{artist.name}</h1>
          <div className="flex w-1 h-1 items-end flex-col gap-1">
            <ActionButton type="edit" onEdit={editArtist} />
            <ActionButton type="delete" onDelete={handleDeleteArtist} confirmMessage="Удалить исполнителя?" />
          </div>
        </div>
        <p><span className="font-semibold">Страна:</span> {artist.country}</p>
        <p><span className="font-semibold">Год основания:</span> {artist.birthYear || '—'}</p>
        <p><span className="font-semibold">Статус:</span> {artist.isActive ? 'Активен' : 'Не активен'}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Альбомы</h2>
          <Link href={`/albums/new?artistId=${artist.id}`} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            + Добавить альбом
          </Link>
        </div>
        {artist.albums.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Нет альбомов</p>
        ) : (
          <div className="grid gap-3">
            {artist.albums.map(album => (
              <div key={album.id} className="relative rounded overflow-hidden bg-gray-200">
                <div className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    {album.coverPath ? (
                      <img src={album.coverPath} alt={album.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <img src="/logo.svg" alt="Logo" className="w-12 h-12 object-cover rounded" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/albums/${album.id}`} className="font-semibold text-blue-600 hover:underline truncate block">
                      {album.title}
                    </Link>
                    <p className="text-sm text-gray-600 truncate">
                      {album.releaseYear} • {album.genre}
                    </p>
                  </div>
                  <div className="flex w-1 items-end flex-col gap-1">
                    <ActionButton type="edit" onEdit={() => editAlbum(album.id)} />
                    <ActionButton type="delete" onDelete={() => deleteAlbum(album.id)} confirmMessage="Удалить альбом?" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}