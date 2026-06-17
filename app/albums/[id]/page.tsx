'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ActionButton from '../../components/ActionButton';

type Album = { id: string; title: string; releaseYear: number; genre: string; coverPath: string | null; isStudio: boolean; artistId: string };
type Track = { id: string; title: string; audioPath: string };

export default function AlbumDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const albumRes = await fetch(`/api/albums/${id}`);
    const albumData = await albumRes.json();
    setAlbum(albumData);
    setArtistId(albumData.artistId);
    const artistRes = await fetch(`/api/artists/${albumData.artistId}`);
    const artistData = await artistRes.json();
    setArtistName(artistData.name);
    const tracksRes = await fetch(`/api/tracks?albumId=${id}`);
    setTracks(await tracksRes.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const deleteAlbum = async () => {
    await fetch(`/api/albums/${id}`, { method: 'DELETE' });
    router.push('/albums');
  };

  const deleteTrack = async (trackId: string) => {
    await fetch(`/api/tracks/${trackId}`, { method: 'DELETE' });
    load();
  };

  const editAlbum = async () => {
    router.push(`/albums/${album?.id}/edit`);
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (!album) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white relative overflow-hidden rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold truncate">{album.title}</h1>
          <div className="flex w-1 h-1 items-end flex-col gap-1">
            <ActionButton type="edit" onEdit={editAlbum} />
            <ActionButton type="delete" onDelete={deleteAlbum} confirmMessage="Удалить альбом?" />
          </div>
        </div>
        
        {album.coverPath && (
          <img src={album.coverPath} alt={album.title} className="w-48 h-48 object-cover rounded mx-auto mb-4" />
        )}
        
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Исполнитель:</span>{' '}
            <Link href={`/artists/${artistId}`} className="text-blue-600 hover:underline">
              {artistName}
            </Link>
          </p>
          <p><span className="font-semibold">Год:</span> {album.releaseYear}</p>
          <p><span className="font-semibold">Жанр:</span> {album.genre}</p>
          <p><span className="font-semibold">Тип:</span> {album.isStudio ? 'Студийный' : 'Концертный'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Треки</h2>
          <Link href={`/tracks/new?albumId=${album.id}`} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            + Добавить трек
          </Link>
        </div>
        
        {tracks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Нет треков</p>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div key={track.id} className="relative rounded-xl overflow-hidden bg-gray-200">
                <div className="py-3">
                  <div className="flex justify-between items-center ml-5 mr-3">
                    <span className="font-medium text-gray-800 truncate">{track.title}</span>
                    <div className="flex w-1 items-end flex-col gap-1">
                      <ActionButton
                        type="delete"
                        onDelete={() => deleteTrack(track.id)}
                        confirmMessage="Удалить трек?"
                      />
                    </div>
                  </div>
                  <audio controls className="w-full h-8" src={track.audioPath}>
                    <source src={track.audioPath} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}