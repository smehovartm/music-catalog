import { Artist, Album, Track } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

// Сиды для артистов
const seedArtists = [
  { id: '1', name: 'SHAMAN', country: 'Россия', birthYear: 1991, isActive: true },
  { id: '2', name: 'Любэ', country: 'Россия', birthYear: 1989, isActive: true },
  { id: '3', name: 'Олег Газманов', country: 'Россия', birthYear: 1951, isActive: true },
  { id: '4', name: 'Григорий Лепс', country: 'Россия', birthYear: 1962, isActive: true },
  { id: '5', name: 'Полина Гагарина', country: 'Россия', birthYear: 1987, isActive: true },
  { id: '6', name: 'Дима Билан', country: 'Россия', birthYear: 1981, isActive: true },
  { id: '7', name: 'Ленинград', country: 'Россия', birthYear: 1997, isActive: true },
  { id: '8', name: 'Король и Шут', country: 'Россия', birthYear: 1988, isActive: false },
  { id: '9', name: 'Владимир Высоцкий', country: 'Россия', birthYear: 1938, isActive: false },
  { id: '10', name: 'Михаил Круг', country: 'Россия', birthYear: 1962, isActive: false },
];

// Сиды для альбомов
const seedAlbums = [
  { id: '1', title: 'Сделано в России', releaseYear: 2023, genre: 'Pop', artistId: '1', coverPath: '/uploads/covers/Шаман-Я русский.jpg', isStudio: true },
  { id: '2', title: 'Эскадрон', releaseYear: 1991, genre: 'Pop', artistId: '3', coverPath: '/uploads/covers/Олег Газманов-Эскадрон.jpg', isStudio: true },
  { id: '3', title: 'Комбат', releaseYear: 1995, genre: 'Rock', artistId: '2', coverPath: null, isStudio: true },
  { id: '4', title: 'Давай за...', releaseYear: 1998, genre: 'Rock', artistId: '2', coverPath: null, isStudio: true },
  { id: '5', title: 'Сделай шаг', releaseYear: 2002, genre: 'Pop', artistId: '4', coverPath: null, isStudio: true },
  { id: '6', title: 'Романы', releaseYear: 2016, genre: 'Pop', artistId: '4', coverPath: null, isStudio: true },
  { id: '7', title: 'Кукушка', releaseYear: 2015, genre: 'Pop', artistId: '5', coverPath: null, isStudio: true },
  { id: '8', title: 'Ночной гость', releaseYear: 2005, genre: 'Pop', artistId: '5', coverPath: null, isStudio: true },
  { id: '9', title: 'Пьяная любовь', releaseYear: 2017, genre: 'Pop', artistId: '6', coverPath: null, isStudio: true },
  { id: '10', title: 'Лесник', releaseYear: 1997, genre: 'Rock', artistId: '8', coverPath: null, isStudio: true },
  { id: '11', title: 'Прыгну со скалы', releaseYear: 2003, genre: 'Rock', artistId: '8', coverPath: null, isStudio: true },
  { id: '12', title: 'Владимирский централ', releaseYear: 1996, genre: 'Chanson', artistId: '10', coverPath: null, isStudio: true },
];
// Сиды для треков
const seedTracks = [
  { id: '1', title: 'Я русский', albumId: '1', audioPath: '/uploads/audio/Шаман-Я русский.mp3' },
  { id: '2', title: 'Встаем', albumId: '1', audioPath: '/uploads/audio/Шаман-Встаем.mp3' },
  { id: '3', title: 'Мой бой', albumId: '1', audioPath: '/uploads/audio/Шаман-Мой бой.mp3' },
  { id: '4', title: 'Эскадрон', albumId: '2', audioPath: '/uploads/audio/Олег Газманов-Эскадрон.mp3' },
  { id: '5', title: 'Свежий ветер', albumId: '2', audioPath: '/uploads/audio/Олег Газманов-Свежий ветер.mp3' },
];

export let artists: Artist[] = [];
export let albums: Album[] = [];
export let tracks: Track[] = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      artists = data.artists || [];
      albums = data.albums || [];
      tracks = data.tracks || [];
    }
  } catch (e) { }
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ artists, albums, tracks }, null, 2));
}

export function initStore() {
  loadData();
  if (artists.length === 0) {
    const now = new Date().toISOString();
    artists = seedArtists.map(a => ({ ...a, createdAt: now, updatedAt: now }));
    albums = seedAlbums.map(a => ({ ...a, createdAt: now, updatedAt: now }));
    tracks = seedTracks.map(t => ({ ...t, createdAt: now, updatedAt: now }));
    saveData();
  }
}

// CRUD для исполнителей
export const addArtist = (a: Artist) => { artists.push(a); saveData(); };
export const updateArtist = (i: number, a: Artist) => { artists[i] = a; saveData(); };
export const deleteArtist = (i: number) => { artists.splice(i, 1); saveData(); };

// CRUD для альбомов
export const addAlbum = (a: Album) => { albums.push(a); saveData(); };
export const updateAlbum = (i: number, a: Album) => { albums[i] = a; saveData(); };
export const deleteAlbum = (i: number) => { albums.splice(i, 1); saveData(); };

// CRUD для треков
export const addTrack = (t: Track) => { tracks.push(t); saveData(); };
export const deleteTrack = (i: number) => { tracks.splice(i, 1); saveData(); };

// поиск
export const findArtist = (id: string) => artists.find(a => a.id === id);
export const findAlbum = (id: string) => albums.find(a => a.id === id);
export const findTrack = (id: string) => tracks.find(t => t.id === id);

initStore();