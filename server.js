// ============================================
// FILE LOCATION: reactapp/backend/server.js
// ============================================
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// ---- MOCK MUSIC DATA ----
// In real app, replace with DB queries / Spotify API
const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://picsum.photos/seed/song1/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Pop",
    liked: false,
  },
  {
    id: 2,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "https://picsum.photos/seed/song2/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "Pop",
    liked: true,
  },
  {
    id: 3,
    title: "Peaches",
    artist: "Justin Bieber",
    album: "Justice",
    duration: "3:18",
    cover: "https://picsum.photos/seed/song3/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    genre: "R&B",
    liked: false,
  },
  {
    id: 4,
    title: "Stay",
    artist: "The Kid LAROI",
    album: "F*CK LOVE 3",
    duration: "2:21",
    cover: "https://picsum.photos/seed/song4/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    genre: "Hip-Hop",
    liked: false,
  },
  {
    id: 5,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    cover: "https://picsum.photos/seed/song5/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    genre: "Pop Rock",
    liked: true,
  },
  {
    id: 6,
    title: "Montero",
    artist: "Lil Nas X",
    album: "Montero",
    duration: "2:17",
    cover: "https://picsum.photos/seed/song6/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    genre: "Hip-Hop",
    liked: false,
  },
  {
    id: 7,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:59",
    cover: "https://picsum.photos/seed/song7/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    genre: "Indie",
    liked: false,
  },
  {
    id: 8,
    title: "Bad Habits",
    artist: "Ed Sheeran",
    album: "=",
    duration: "3:51",
    cover: "https://picsum.photos/seed/song8/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    genre: "Pop",
    liked: true,
  },
  {
    id: 9,
    title: "Happier Than Ever",
    artist: "Billie Eilish",
    album: "Happier Than Ever",
    duration: "4:58",
    cover: "https://picsum.photos/seed/song9/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    genre: "Alternative",
    liked: false,
  },
  {
    id: 10,
    title: "Industry Baby",
    artist: "Lil Nas X",
    album: "Montero",
    duration: "3:32",
    cover: "https://picsum.photos/seed/song10/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    genre: "Hip-Hop",
    liked: false,
  },
];

const playlists = [
  { id: 1, name: "Trending Now", songIds: [1, 2, 3, 4, 5] },
  { id: 2, name: "Liked Songs", songIds: [2, 5, 8] },
  { id: 3, name: "Hip-Hop Hits", songIds: [4, 6, 10] },
  { id: 4, name: "Chill Vibes", songIds: [7, 9, 3] },
];

// ---- ROUTES ----

// GET all songs
app.get("/api/songs", (req, res) => {
  const { genre, search } = req.query;
  let result = [...songs];
  if (genre) result = result.filter((s) => s.genre === genre);
  if (search)
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.artist.toLowerCase().includes(search.toLowerCase())
    );
  res.json({ success: true, data: result });
});

// GET single song
app.get("/api/songs/:id", (req, res) => {
  const song = songs.find((s) => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ success: false, message: "Song not found" });
  res.json({ success: true, data: song });
});

// GET all playlists
app.get("/api/playlists", (req, res) => {
  const detailed = playlists.map((p) => ({
    ...p,
    songs: p.songIds.map((id) => songs.find((s) => s.id === id)).filter(Boolean),
    cover: songs.find((s) => s.id === p.songIds[0])?.cover,
  }));
  res.json({ success: true, data: detailed });
});

// GET songs by playlist
app.get("/api/playlists/:id/songs", (req, res) => {
  const playlist = playlists.find((p) => p.id === parseInt(req.params.id));
  if (!playlist) return res.status(404).json({ success: false, message: "Playlist not found" });
  const playlistSongs = playlist.songIds.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
  res.json({ success: true, data: playlistSongs });
});

// TOGGLE like
app.post("/api/songs/:id/like", (req, res) => {
  const song = songs.find((s) => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ success: false, message: "Song not found" });
  song.liked = !song.liked;
  res.json({ success: true, liked: song.liked });
});

// GET genres
app.get("/api/genres", (req, res) => {
  const genres = [...new Set(songs.map((s) => s.genre))];
  res.json({ success: true, data: genres });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Music API is running 🎵" });
});

app.listen(PORT, () => {
  console.log(`🎵 Music Backend running at http://localhost:${PORT}/`);

});
