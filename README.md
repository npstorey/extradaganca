# Extradaganca UI Prototype

A chaotic, dreamlike futuristic-retro interface for creating "vibe artifacts" - digital expressions of mood, setting, and aesthetic.

![Extradaganca UI Screenshot](screenshot.png)

## Overview

The Extradaganca UI embraces a chaotic, dreamlike, futuristic-retro aesthetic. It draws inspiration from early cyberpunk visuals and vintage computing, combining elements like CRT monitor effects, pixelation, glitch art, and retro-futuristic typography to create an immersive, otherworldly experience.

The interface guides users through a 5-step process to create a unique "vibe artifact":

1. **Location** - Specify where the vibe takes place
2. **Time Period** - Choose past, present, or future
3. **Reality Type** - Select real life or imaginary
4. **Vibe Description** - Describe the vibe in detail and upload reference media
5. **Convergence/Divergence** - Determine how closely the artifact should align with reality

## Technologies Used

- React with TypeScript
- Vite for fast building and development
- Styled Components for styling
- Framer Motion for animations
- Howler for audio effects

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/extradaganca.git
cd extradaganca
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Features

- **Retro-Futuristic UI**: CRT screen effects, glitch animations, terminal-style text
- **Interactive Elements**: Chunky buttons, sliders, and toggles with tactile feedback
- **Guided Sequence**: Step-by-step vibe creation process with narrative flow
- **Visual Effects**: Random glitches, scan lines, and artifacts enhance the chaotic aesthetic
- **Responsive Design**: Works on various screen sizes while maintaining the retro vibe

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, sounds)
├── components/      # React components
│   ├── steps/       # Step screens for the vibe creation flow
│   └── ui/          # Reusable UI components
├── context/         # React context for state management
├── hooks/           # Custom React hooks
├── styles/          # Global styles and theming
└── types/           # TypeScript type definitions
```

## Contributing

This is a prototype project. Feel free to fork and experiment with the UI. Pull requests are welcome!

## License

MIT

---

*Extradaganca - Creating Digital Vibe Artifacts from Another Timeline*
