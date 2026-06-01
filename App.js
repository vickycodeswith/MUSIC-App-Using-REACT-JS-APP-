// ============================================
// FILE LOCATION: reactapp/my-app/src/App.js
// (REPLACE the existing App.js with this file)
// ============================================
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const API = "https://music-app-using-react-js-app.onrender.com/api";

// ── ICONS (inline SVG so no install needed) ──────────────────────────────────
const Icon = {
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Next: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
    </svg>
  ),
  Prev: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6l-8.5 6zm6.5 2.14L13.97 12 16 9.86v4.28z" />
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="1em" height="1em">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Shuffle: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  ),
  Repeat: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
  ),
  Volume: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  ),
  Music: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  Library: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
    </svg>
  ),
  Queue: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
    </svg>
  ),
};

// ── MOCK FALLBACK DATA (if backend is down) ──────────────────────────────────
const FALLBACK_SONGS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: ["Blinding Lights","Levitating","Peaches","Stay","Good 4 U","Montero","Heat Waves","Bad Habits","Happier Than Ever","Industry Baby"][i],
  artist: ["The Weeknd","Dua Lipa","Justin Bieber","The Kid LAROI","Olivia Rodrigo","Lil Nas X","Glass Animals","Ed Sheeran","Billie Eilish","Lil Nas X"][i],
  album: ["After Hours","Future Nostalgia","Justice","F*CK LOVE 3","SOUR","Montero","Dreamland","=","Happier Than Ever","Montero"][i],
  duration: ["3:20","3:23","3:18","2:21","2:58","2:17","3:59","3:51","4:58","3:32"][i],
  cover: `https://picsum.photos/seed/song${i + 1}/300/300`,
  audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`,
  genre: ["Pop","Pop","R&B","Hip-Hop","Pop Rock","Hip-Hop","Indie","Pop","Alternative","Hip-Hop"][i],
  liked: [false,true,false,false,true,false,false,true,false,false][i],
}));

// ── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [activeGenre, setActiveGenre] = useState("All");
  const [genres, setGenres] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const audioRef = useRef(null);

  // ── Fetch Data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, playlistsRes, genresRes] = await Promise.all([
          fetch(`${API}/songs`),
          fetch(`${API}/playlists`),
          fetch(`${API}/genres`),
        ]);
        const songsData = await songsRes.json();
        const playlistsData = await playlistsRes.json();
        const genresData = await genresRes.json();
        setSongs(songsData.data);
        setPlaylists(playlistsData.data);
        setGenres(["All", ...genresData.data]);
      } catch {
        setSongs(FALLBACK_SONGS);
        setGenres(["All", "Pop", "Hip-Hop", "R&B", "Indie", "Alternative", "Pop Rock"]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Audio Setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      if (repeat) { audio.currentTime = 0; audio.play(); }
      else handleNext();
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong, repeat]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  }, []);

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
    else { audioRef.current?.play().catch(() => {}); setIsPlaying(true); }
  };

  const handleNext = useCallback(() => {
    if (!songs.length) return;
    if (shuffle) { playSong(songs[Math.floor(Math.random() * songs.length)]); return; }
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    playSong(songs[(idx + 1) % songs.length]);
  }, [songs, currentSong, shuffle, playSong]);

  const handlePrev = () => {
    if (!songs.length) return;
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    playSong(songs[(idx - 1 + songs.length) % songs.length]);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const toggleLike = async (songId) => {
    try { await fetch(`${API}/songs/${songId}/like`, { method: "POST" }); }
    catch {}
    setSongs((prev) => prev.map((s) => s.id === songId ? { ...s, liked: !s.liked } : s));
    if (currentSong?.id === songId) setCurrentSong((s) => ({ ...s, liked: !s.liked }));
  };

  const fmt = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const filteredSongs = songs.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());
    const matchGenre = activeGenre === "All" || s.genre === activeGenre;
    return matchSearch && matchGenre;
  });

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className={`app ${isPlaying ? "playing" : ""}`}>
      <audio ref={audioRef} />

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-logo">
          <span className="logo-icon"><Icon.Music /></span>
          {sidebarOpen && <span className="logo-text">Melodia</span>}
        </div>

        <nav className="sidebar-nav">
          {[
            { id: "home", icon: <Icon.Home />, label: "Home" },
            { id: "search", icon: <Icon.Search />, label: "Search" },
            { id: "library", icon: <Icon.Library />, label: "Library" },
            { id: "liked", icon: <Icon.Heart filled />, label: "Liked Songs" },
            { id: "queue", icon: <Icon.Queue />, label: "Queue" },
          ].map((item) => (
            <button key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && playlists.length > 0 && (
          <div className="playlist-section">
            <h4 className="section-title">Playlists</h4>
            {playlists.map((p) => (
              <div key={p.id} className="playlist-item" onClick={() => setActiveView(`playlist-${p.id}`)}>
                <img src={p.cover} alt={p.name} className="playlist-thumb" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        )}

        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <span className="search-icon"><Icon.Search /></span>
            <input className="search-input" placeholder="Search songs, artists..."
              value={search} onChange={(e) => { setSearch(e.target.value); setActiveView("home"); }} />
          </div>
          {currentSong && (
            <div className="topbar-now-playing">
              <img src={currentSong.cover} alt="" className="topbar-thumb" />
              <div>
                <div className="topbar-title">{currentSong.title}</div>
                <div className="topbar-artist">{currentSong.artist}</div>
              </div>
            </div>
          )}
        </header>

        {/* CONTENT AREA */}
        <div className="content-area">
          {loading ? (
            <div className="loading-screen">
              <div className="loading-spinner"></div>
              <p>Loading your music...</p>
            </div>
          ) : (
            <>
              {/* Genre Filter */}
              {(activeView === "home" || activeView === "search") && (
                <div className="genre-filter">
                  {genres.map((g) => (
                    <button key={g} className={`genre-chip ${activeGenre === g ? "active" : ""}`}
                      onClick={() => setActiveGenre(g)}>{g}</button>
                  ))}
                </div>
              )}

              {/* Hero Banner */}
              {activeView === "home" && !search && currentSong && (
                <div className="hero-banner" style={{ backgroundImage: `url(${currentSong.cover})` }}>
                  <div className="hero-overlay">
                    <div className="hero-text">
                      <span className="hero-tag">Now Playing</span>
                      <h1 className="hero-title">{currentSong.title}</h1>
                      <p className="hero-artist">{currentSong.artist}</p>
                    </div>
                    <button className="hero-play-btn" onClick={togglePlay}>
                      {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                    </button>
                  </div>
                </div>
              )}

              {/* Songs Grid */}
              {(activeView === "home" || activeView === "search") && (
                <>
                  <h2 className="section-heading">
                    {search ? `Results for "${search}"` : activeGenre === "All" ? "All Songs" : activeGenre}
                  </h2>
                  <div className="songs-grid">
                    {filteredSongs.map((song) => (
                      <SongCard key={song.id} song={song}
                        isActive={currentSong?.id === song.id}
                        isPlaying={isPlaying && currentSong?.id === song.id}
                        onPlay={() => playSong(song)}
                        onLike={() => toggleLike(song.id)} />
                    ))}
                    {filteredSongs.length === 0 && (
                      <div className="no-results">No songs found 🎵</div>
                    )}
                  </div>
                </>
              )}

              {/* Liked Songs */}
              {activeView === "liked" && (
                <>
                  <div className="page-header liked-header">
                    <div className="page-header-icon">♥</div>
                    <div>
                      <h1>Liked Songs</h1>
                      <p>{songs.filter((s) => s.liked).length} songs</p>
                    </div>
                  </div>
                  <div className="songs-list">
                    {songs.filter((s) => s.liked).map((song, i) => (
                      <SongRow key={song.id} song={song} index={i + 1}
                        isActive={currentSong?.id === song.id}
                        isPlaying={isPlaying && currentSong?.id === song.id}
                        onPlay={() => playSong(song)}
                        onLike={() => toggleLike(song.id)} />
                    ))}
                  </div>
                </>
              )}

              {/* Library */}
              {activeView === "library" && (
                <>
                  <h2 className="section-heading">Your Library</h2>
                  <div className="playlists-grid">
                    {playlists.map((p) => (
                      <div key={p.id} className="playlist-card"
                        onClick={() => setActiveView(`playlist-${p.id}`)}>
                        <img src={p.cover} alt={p.name} className="playlist-cover" />
                        <div className="playlist-info">
                          <div className="playlist-name">{p.name}</div>
                          <div className="playlist-count">{p.songs?.length} songs</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Playlist View */}
              {activeView.startsWith("playlist-") && (() => {
                const pid = parseInt(activeView.split("-")[1]);
                const pl = playlists.find((p) => p.id === pid);
                if (!pl) return null;
                return (
                  <>
                    <div className="page-header playlist-header"
                      style={{ backgroundImage: `url(${pl.cover})` }}>
                      <div className="page-header-overlay">
                        <h1>{pl.name}</h1>
                        <p>{pl.songs?.length} songs</p>
                        <button className="play-all-btn" onClick={() => pl.songs?.[0] && playSong(pl.songs[0])}>
                          <Icon.Play /> Play All
                        </button>
                      </div>
                    </div>
                    <div className="songs-list">
                      {pl.songs?.map((song, i) => (
                        <SongRow key={song.id} song={song} index={i + 1}
                          isActive={currentSong?.id === song.id}
                          isPlaying={isPlaying && currentSong?.id === song.id}
                          onPlay={() => playSong(song)}
                          onLike={() => toggleLike(song.id)} />
                      ))}
                    </div>
                  </>
                );
              })()}

              {/* Queue */}
              {activeView === "queue" && (
                <>
                  <h2 className="section-heading">Up Next</h2>
                  <div className="songs-list">
                    {songs.map((song, i) => (
                      <SongRow key={song.id} song={song} index={i + 1}
                        isActive={currentSong?.id === song.id}
                        isPlaying={isPlaying && currentSong?.id === song.id}
                        onPlay={() => playSong(song)}
                        onLike={() => toggleLike(song.id)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* BOTTOM PLAYER */}
      {currentSong && (
        <footer className="player-bar">
          <div className="player-song-info">
            <img src={currentSong.cover} alt="" className="player-thumb" />
            <div className="player-meta">
              <div className="player-title">{currentSong.title}</div>
              <div className="player-artist">{currentSong.artist}</div>
            </div>
            <button className={`like-btn ${currentSong.liked ? "liked" : ""}`}
              onClick={() => toggleLike(currentSong.id)}>
              <Icon.Heart filled={currentSong.liked} />
            </button>
          </div>

          <div className="player-controls">
            <button className={`ctrl-btn ${shuffle ? "active" : ""}`} onClick={() => setShuffle(!shuffle)}>
              <Icon.Shuffle />
            </button>
            <button className="ctrl-btn ctrl-main" onClick={handlePrev}><Icon.Prev /></button>
            <button className="play-pause-btn" onClick={togglePlay}>
              {isPlaying ? <Icon.Pause /> : <Icon.Play />}
            </button>
            <button className="ctrl-btn ctrl-main" onClick={handleNext}><Icon.Next /></button>
            <button className={`ctrl-btn ${repeat ? "active" : ""}`} onClick={() => setRepeat(!repeat)}>
              <Icon.Repeat />
            </button>
          </div>

          <div className="player-progress-wrap">
            <span className="time-label">{fmt(progress)}</span>
            <input type="range" className="progress-slider" min="0" max={duration || 0}
              step="0.1" value={progress} onChange={handleSeek} />
            <span className="time-label">{fmt(duration)}</span>
          </div>

          <div className="player-volume">
            <Icon.Volume />
            <input type="range" className="volume-slider" min="0" max="1"
              step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          </div>
        </footer>
      )}
    </div>
  );
}

// ── SONG CARD (grid view) ────────────────────────────────────────────────────
function SongCard({ song, isActive, isPlaying, onPlay, onLike }) {
  return (
    <div className={`song-card ${isActive ? "active" : ""}`}>
      <div className="song-card-cover-wrap" onClick={onPlay}>
        <img src={song.cover} alt={song.title} className="song-card-cover" />
        <div className="song-card-overlay">
          <div className="song-card-play-icon">
            {isPlaying ? <Icon.Pause /> : <Icon.Play />}
          </div>
          {isPlaying && (
            <div className="playing-bars">
              <span /><span /><span /><span />
            </div>
          )}
        </div>
      </div>
      <div className="song-card-info">
        <div className="song-card-title">{song.title}</div>
        <div className="song-card-artist">{song.artist}</div>
        <div className="song-card-footer">
          <span className="song-card-genre">{song.genre}</span>
          <button className={`song-like-btn ${song.liked ? "liked" : ""}`} onClick={(e) => { e.stopPropagation(); onLike(); }}>
            <Icon.Heart filled={song.liked} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SONG ROW (list view) ────────────────────────────────────────────────────
function SongRow({ song, index, isActive, isPlaying, onPlay, onLike }) {
  return (
    <div className={`song-row ${isActive ? "active" : ""}`} onClick={onPlay}>
      <div className="song-row-num">
        {isPlaying ? (
          <div className="row-playing-bars"><span /><span /><span /></div>
        ) : (
          <span className="row-index">{index}</span>
        )}
      </div>
      <img src={song.cover} alt="" className="song-row-thumb" />
      <div className="song-row-meta">
        <div className="song-row-title">{song.title}</div>
        <div className="song-row-artist">{song.artist}</div>
      </div>
      <div className="song-row-album">{song.album}</div>
      <button className={`song-like-btn ${song.liked ? "liked" : ""}`}
        onClick={(e) => { e.stopPropagation(); onLike(); }}>
        <Icon.Heart filled={song.liked} />
      </button>
      <div className="song-row-duration">{song.duration}</div>
    </div>
  );
}