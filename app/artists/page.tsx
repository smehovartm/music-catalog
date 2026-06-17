'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ActionButton from '../components/ActionButton';

type Artist = { id: string; name: string; country: string; birthYear: number | null; isActive: boolean };

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '5',
      ...(debouncedSearch && { search: debouncedSearch })
    });
    const res = await fetch(`/api/artists?${params}`);
    const data = await res.json();
    setArtists(data.items);
    setTotalPages(data.pages);
    setLoading(false);
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (!loading && page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page, loading]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const deleteArtist = async (id: string) => {
    await fetch(`/api/artists/${id}`, { method: 'DELETE' });
    fetchArtists();
  };

  const editArtist = async (id: string) => {
    window.location.href = `/artists/${id}/edit`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Исполнители</h1>
        <Link href="/artists/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ Новый</Link>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Поиск исполнителей..."
          className="w-full border text-black p-2 rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="text-center py-10">Загрузка...</div>}

      {!loading && (
        <>
          <div className="space-y-3">
            {artists.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Ничего не найдено</div>
            ) : (
              artists.map(artist => (
                <div key={artist.id} className="relative rounded overflow-hidden bg-gray-200">
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/artists/${artist.id}`} className="text-xl font-semibold text-blue-600 truncate block">
                        {artist.name}
                      </Link>
                      <p className="text-gray-600 truncate">
                        {artist.country} • {artist.isActive ? 'Активен' : 'Не активен'}
                      </p>
                    </div>
                    <div className="flex w-1 items-end flex-col gap-1">
                      <ActionButton type="edit" onEdit={() => editArtist(artist.id)} />
                      <ActionButton
                        type="delete"
                        onDelete={() => deleteArtist(artist.id)}
                        confirmMessage="Удалить исполнителя?"
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
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded text-gray-600 disabled:opacity-50">
                Назад
              </button>
              <span>{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-gray-200 rounded text-gray-600 disabled:opacity-50">
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}