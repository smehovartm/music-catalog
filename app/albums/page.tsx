'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ActionButton from '../components/ActionButton';

type Album = { id: string; title: string; releaseYear: number; genre: string; artistName: string; artistId: string; coverPath: string | null; isStudio: boolean };
type Artist = { id: string; name: string };

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [artistId, setArtistId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ 
      page: String(page), 
      limit: '5', 
      ...(debouncedSearch && { search: debouncedSearch }), 
      ...(artistId && { artistId }) 
    });
    const [albumsRes, artistsRes] = await Promise.all([
      fetch(`/api/albums?${params}`), 
      fetch('/api/artists?limit=100')
    ]);
    const albumsData = await albumsRes.json();
    const artistsData = await artistsRes.json();
    setAlbums(albumsData.items);
    setTotalPages(albumsData.pages);
    setArtists(artistsData.items);
    setLoading(false);
  }, [page, debouncedSearch, artistId]);

  useEffect(() => {
    if (!loading && page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page, loading]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const deleteAlbum = async (id: string) => {
    await fetch(`/api/albums/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const editAlbum = async (id: string) => {
    window.location.href = `/albums/${id}/edit`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Альбомы</h1>
        <Link href="/albums/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ Новый</Link>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="Поиск..." 
          className="border text-black p-2 rounded" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <select 
          className="border text-black p-2 rounded" 
          value={artistId} 
          onChange={e => { 
            setArtistId(e.target.value); 
            setPage(1);
          }}
        >
          <option value="">Все исполнители</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-10">Загрузка...</div>}

      {!loading && (
        <>
          <div className="space-y-3">
            {albums.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Ничего не найдено</div>
            ) : (
              albums.map(album => (
                <div key={album.id} className="relative rounded overflow-hidden bg-gray-200">
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded flex items-center justify-center flex-shrink-0">
                      {album.coverPath ? (
                        <img src={album.coverPath} alt={album.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <img src="/logo.svg" alt="Logo" className="w-16 h-16 object-cover rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/albums/${album.id}`} className="font-semibold text-blue-600 truncate block">
                        {album.title}
                      </Link>
                      <p className="text-sm text-gray-600 truncate">
                        {album.artistName} • {album.releaseYear} • {album.genre}
                      </p>
                    </div>
                    <div className="flex w-1 items-end flex-col gap-1">
                      <ActionButton 
                        type="edit"
                        onEdit={() => editAlbum(album.id)}
                      />
                      <ActionButton 
                        type="delete"
                        onDelete={() => deleteAlbum(album.id)}
                        confirmMessage="Удалить альбом?"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={() => setPage(p => p-1)} 
                disabled={page === 1} 
                className="px-4 py-2 bg-gray-200 rounded text-gray-600 disabled:opacity-50"
              >
                Назад
              </button>
              <span>{page} / {totalPages}</span>
              <button 
                onClick={() => setPage(p => p+1)} 
                disabled={page >= totalPages} 
                className="px-4 py-2 bg-gray-200 rounded text-gray-600 disabled:opacity-50"
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}