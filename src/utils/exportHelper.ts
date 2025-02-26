import { Vibe } from "../types/vibe";
import { VibeTheme } from "../services/styleExtractionService";

/**
 * Exports a generated vibe as an HTML file with styling
 * @param vibe The generated vibe to export
 * @param theme The current theme applied to the vibe
 * @returns void
 */
export const exportVibeToHTML = (vibe: Vibe, theme: VibeTheme): void => {
  // Create HTML content with styling based on the current theme
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vibe.title || 'Exported Vibe'}</title>
  <style>
    :root {
      --primary-color: ${theme.primaryColor};
      --accent-color: ${theme.accentColor};
      --background-color: ${theme.backgroundColor};
      --text-color: ${theme.textColor};
      --title-font: ${theme.titleFontFamily};
      --body-font: ${theme.fontFamily};
      --border-radius: ${theme.borderRadius};
      --spacing: ${theme.spacing};
    }
    
    body {
      margin: 0;
      padding: 0;
      background-color: var(--background-color);
      color: var(--text-color);
      font-family: var(--body-font), sans-serif;
      line-height: 1.6;
      transition: all 0.3s ease;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .vibe-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .vibe-title {
      font-family: var(--title-font), sans-serif;
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    
    .vibe-description {
      font-size: 1.2rem;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.8;
    }
    
    .section {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--primary-color);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .section-title {
      font-family: var(--title-font), sans-serif;
      font-size: 1.8rem;
      color: var(--accent-color);
      margin-top: 0;
      margin-bottom: 1rem;
      border-bottom: 2px solid var(--accent-color);
      padding-bottom: 0.5rem;
    }
    
    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--spacing);
      margin-top: 1.5rem;
    }
    
    .vibe-image {
      width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      border: 2px solid var(--accent-color);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }
    
    .vibe-image:hover {
      transform: scale(1.02);
    }
    
    .song-list {
      list-style: none;
      padding: 0;
    }
    
    .song-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .song-item:last-child {
      border-bottom: none;
    }
    
    .song-title {
      font-weight: bold;
      margin-right: 0.5rem;
    }
    
    .song-artist {
      opacity: 0.8;
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      opacity: 0.6;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .vibe-title {
        font-size: 2.2rem;
      }
      
      .images-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="vibe-header">
      <h1 class="vibe-title">${vibe.title || 'Untitled Vibe'}</h1>
      <p class="vibe-description">${vibe.description || 'No description available'}</p>
    </div>
    
    ${vibe.imageUrls && vibe.imageUrls.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Visual Inspiration</h2>
      <div class="images-grid">
        ${vibe.imageUrls.map((url: string) => `
          <img class="vibe-image" src="${url}" alt="Vibe inspiration image" />
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    ${vibe.playlist ? `
    <div class="section">
      <h2 class="section-title">Soundtrack</h2>
      <p>Playlist link: <a href="${vibe.playlist}" target="_blank" rel="noopener noreferrer">${vibe.playlist}</a></p>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>Exported from Vibe Generator - ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create download link
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${vibe.title ? vibe.title.replace(/\s+/g, '-').toLowerCase() : 'vibe'}-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}; 