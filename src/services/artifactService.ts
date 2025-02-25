/**
 * Service for compiling the final vibe artifacts
 */
import { GeneratedVibe, VibeSummary, VibeImage, VibeSong } from '../types/vibeTypes';

/**
 * Compiles all the generated components into a single vibe object
 */
export const compileVibe = (
  summary: VibeSummary,
  images: VibeImage[],
  songs: { artist: string; title: string }[],
  playlistUrl?: string
): GeneratedVibe => {
  // Convert song recommendations to VibeSong objects (without Spotify integration for now)
  const formattedSongs: VibeSong[] = songs.map(song => ({
    artist: song.artist,
    title: song.title,
    uri: '', // This would normally be populated by Spotify integration
  }));

  // Compile everything into a single vibe object
  return {
    summary,
    images,
    songs: formattedSongs,
    playlistUrl,
    createdAt: new Date(),
  };
};

/**
 * Generate a simple HTML page for the vibe (for demo purposes)
 */
export const generateVibeHtml = (vibe: GeneratedVibe): string => {
  // Create HTML for the images
  const imagesHtml = vibe.images
    .map(
      image => `
      <div class="image-container">
        <img src="${image.url}" alt="${vibe.summary.title}" class="vibe-image">
      </div>
    `
    )
    .join('');

  // Create HTML for the songs
  const songsHtml = vibe.songs
    .map(
      song => `
      <div class="song">
        <span class="song-title">${song.title}</span> by <span class="song-artist">${song.artist}</span>
      </div>
    `
    )
    .join('');

  // Create the full HTML
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${vibe.summary.title} | Vibe Generator</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          color: #333;
        }
        header {
          text-align: center;
          margin-bottom: 30px;
        }
        h1 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        .description {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .vibe-image {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .songs-section {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .song {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .song-title {
          font-weight: bold;
        }
        .song-artist {
          color: #666;
        }
        footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>${vibe.summary.title}</h1>
        <div class="description">${vibe.summary.description}</div>
      </header>
      
      <div class="images">
        ${imagesHtml}
      </div>
      
      <div class="songs-section">
        <h2>Soundtrack for Your Vibe:</h2>
        ${songsHtml}
        ${
          vibe.playlistUrl
            ? `<p><a href="${vibe.playlistUrl}" target="_blank">Listen on Spotify</a></p>`
            : ''
        }
      </div>
      
      <footer>
        <p>Generated on ${vibe.createdAt.toLocaleDateString()} by Vibe Generator</p>
      </footer>
    </body>
    </html>
  `;
};

/**
 * Format the vibe as a JSON response
 */
export const formatVibeResponse = (vibe: GeneratedVibe, requestId: string) => {
  return {
    requestId,
    vibe,
  };
}; 