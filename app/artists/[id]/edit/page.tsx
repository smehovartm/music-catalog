'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CharCounter from '@/app/components/CharCounter';

export default function EditArtistPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', country: '', birthYear: '', isActive: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/artists/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name,
          country: data.country,
          birthYear: data.birthYear?.toString() || '',
          isActive: data.isActive,
        });
        setLoading(false);
      })
      .catch(() => setError('Ошибка загрузки'));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/artists/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        country: form.country,
        birthYear: form.birthYear ? parseInt(form.birthYear) : null,
        isActive: form.isActive,
      }),
    });
    if (res.ok) router.push(`/artists/${params.id}`);
    else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Редактирование исполнителя</h1>
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
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}