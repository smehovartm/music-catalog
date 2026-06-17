'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CharCounter from '@/app/components/CharCounter';

export default function NewArtistPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', country: '', birthYear: '', isActive: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        country: form.country,
        birthYear: form.birthYear ? parseInt(form.birthYear) : null,
        isActive: form.isActive,
      }),
    });

    if (res.ok) router.push('/artists');
    else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Новый исполнитель</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <label className="block font-medium">Имя *</label>
            <CharCounter value={form.name} maxLength={50} />
          </div>
          <input
            type="text"
            required
            maxLength={50}
            className="w-full border p-2 rounded mt-1"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="block font-medium">Страна *</label>
            <CharCounter value={form.country} maxLength={50} />
          </div>
          <input
            type="text"
            required
            maxLength={50}
            className="w-full border p-2 rounded mt-1"
            value={form.country}
            onChange={e => setForm({...form, country: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-medium">Год основания</label>
          <input
            type="number"
            className="w-full border p-2 rounded mt-1"
            value={form.birthYear}
            onChange={e => setForm({...form, birthYear: e.target.value})}
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm({...form, isActive: e.target.checked})}
            />
            Активен
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
        >
          {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>
    </div>
  );
}