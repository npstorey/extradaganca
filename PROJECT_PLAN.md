# Vibe Generator: LLM Orchestration MVP Project Plan

## Project Overview

The Vibe Generator is an application that orchestrates multiple AI services (LLMs, image generation, music API) to produce a personalized "vibe" experience for users. Based on answers to 5 simple questions, the system generates:

1. A textual "vibe summary" (300-500 characters)
2. 5 AI-generated images matching the vibe
3. A curated Spotify playlist with 5-10 songs that fit the mood

The MVP will focus on implementing and testing the complete pipeline in a backend environment before integrating any user interface.

## Tech Stack Selection

### Backend Framework
We'll use **Node.js with TypeScript and Fastify** for our backend implementation:
- TypeScript provides strong typing for better code quality and maintainability
- Fastify offers high performance with minimal setup
- Excellent for handling asynchronous API calls

### Key Libraries
- `openai` - Official OpenAI SDK for LLM and image generation calls
- `spotify-web-api-node` - Wrapper for Spotify API integration
- `dotenv` - For secure environment variable management
- `axios` - For any additional HTTP requests

## External APIs & Services Required

### 1. OpenAI API
- Purpose: Text generation (GPT-4) and image generation (DALL-E)
- Authentication: API key
- Pricing: Pay-per-token for text, pay-per-image for DALL-E
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

### 2. Spotify API
- Purpose: Song search and playlist creation
- Authentication: OAuth 2.0 (client ID, client secret, user authorization)
- Pricing: Free with rate limits
- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)

### 3. (Optional) Stability AI
- Purpose: Alternative image generation if needed
- Authentication: API key
- Pricing: Pay-per-image
- [Stability AI Documentation](https://platform.stability.ai/docs/api-reference)

## Project Structure

```
vibe-generator/
├── src/
│   ├── main.ts                  # Entry point, orchestration logic
│   ├── types/                   # TypeScript interfaces/types
│   │   ├── vibeTypes.ts         # Types for vibe data structures
│   │   └── apiTypes.ts          # Interface types for API responses
│   ├── prompts/
│   │   └── templates.ts         # LLM prompt templates
│   ├── services/
│   │   ├── llmService.ts        # OpenAI API wrapper for text generation
│   │   ├── imageService.ts      # Image generation service
│   │   ├── musicService.ts      # Spotify API integration
│   │   └── artifactService.ts   # Final artifact generation
│   ├── utils/
│   │   ├── config.ts            # Environment configuration 
│   │   └── apiHelpers.ts        # Common API utility functions
│   └── constants/
│       └── questions.ts         # User questions definitions
├── .env                         # Environment variables (not in version control)
├── .env.example                 # Example environment variables file
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Implementation Plan

### Phase 1: Project Setup (Days 1-2)

1. **Initialize Project Structure**
   - Set up TypeScript project with Fastify
   - Configure ESLint and Prettier
   - Create folder structure as outlined above

2. **Configure Environment**
   - Create `.env` file for API keys
   - Set up environment loading with dotenv
   - Create config utility for secure API key access

3. **Install Dependencies**
   - Add required packages via npm/yarn

### Phase 2: Core Service Implementation (Days 3-7)

1. **LLM Service (Day 3)**
   - Create prompt templates for:
     - Vibe summary generation
     - Image prompt generation
     - Song recommendation
   - Implement OpenAI API wrapper functions
   - Add error handling and retry logic

2. **Image Service (Day 4)**
   - Implement DALL-E API integration
   - Create functions to generate images from prompts
   - Add error handling for image generation failures

3. **Music Service (Days 5-6)**
   - Implement Spotify authentication flow
   - Create song search functionality
   - Implement playlist creation and track addition
   - Handle errors for song search misses

4. **Artifact Service (Day 7)**
   - Create HTML template for vibe page
   - Implement function to compile vibe summary, images, and playlist into final format
   - Add structured JSON output for future frontend integration

### Phase 3: Pipeline Orchestration (Days 8-9)

1. **Main Orchestration Function**
   - Implement the core pipeline flow
   - Connect all services in the proper sequence
   - Add logging for each step
   - Implement proper error handling

2. **Performance Optimization**
   - Add parallel processing where possible (e.g., image generation)
   - Implement caching for frequent API calls
   - Add timeouts to prevent hanging processes

### Phase 4: Testing & Refinement (Days 10-14)

1. **Testing Framework Setup**
   - Set up Jest or Vitest for testing
   - Create mock APIs for testing without real API calls

2. **Unit Tests**
   - Write tests for individual service functions
   - Test prompt templates for expected outputs

3. **Integration Tests**
   - Test full pipeline with sample inputs
   - Verify output structure and content

4. **Manual Testing**
   - Test with various inputs to ensure robust output
   - Validate image generation quality and relevance
   - Check Spotify playlist creation and song selection

5. **Refinements**
   - Tune prompts for better results
   - Adjust timeout values and retry logic
   - Optimize performance where needed

## External Setup Requirements

Before starting development, you'll need to set up the following:

### 1. OpenAI API Access
- Create an OpenAI account at [platform.openai.com](https://platform.openai.com/)
- Generate an API key with access to GPT-4 and DALL-E models
- Add funds to your account (estimate $50-100 for development/testing)
- Add the API key to your `.env` file as `OPENAI_API_KEY`

### 2. Spotify Developer Account
- Create a Spotify Developer account at [developer.spotify.com](https://developer.spotify.com/)
- Create a new application in the Spotify Developer Dashboard
- Set a redirect URI (can be localhost for testing)
- Note your Client ID and Client Secret
- Add these credentials to your `.env` file as:
  ```
  SPOTIFY_CLIENT_ID=your_client_id
  SPOTIFY_CLIENT_SECRET=your_client_secret
  SPOTIFY_REDIRECT_URI=your_redirect_uri
  ```
- For testing, you'll need to manually generate a refresh token with the following scopes:
  - `playlist-modify-public`
  - `playlist-modify-private`
  - `user-read-private`

### 3. (Optional) Stability AI API
- If using Stability AI, create an account at [platform.stability.ai](https://platform.stability.ai/)
- Generate an API key and add it to your `.env` file as `STABILITY_API_KEY`

## Success Criteria

The MVP will be considered successful when:

1. The pipeline can take 5 user inputs and generate a complete vibe package (summary, images, playlist)
2. All API integrations work reliably with proper error handling
3. The generated content is coherent and matches the user's inputs
4. The process completes in a reasonable time (ideally under 30 seconds)
5. The output format is ready for future UI integration

## Future Enhancements (Post-MVP)

### Frontend Integration
- Develop a web UI using React/Next.js or integrate with Lovable.dev
- Create a multi-step form for collecting user inputs
- Display the generated vibe in an appealing format

### User Management
- Integrate Supabase for user authentication
- Allow users to save and share their generated vibes
- Implement history of past vibes

### Feature Enhancements
- Allow regeneration of specific components (just the images, just the playlist)
- Add more customization options (image style, music genre preferences)
- Implement social sharing capabilities

### Performance Improvements
- Optimize prompts for better cost efficiency
- Add more caching layers to improve response time
- Implement queue system for handling multiple simultaneous requests

## Cost Estimates

For development and initial testing:

- OpenAI API (GPT-4): ~$30 
  - Approximately $0.03-0.06 per vibe generation
- DALL-E Image Generation: ~$50
  - $0.04-0.08 per image, 5 images per vibe
- Spotify API: Free
- Development server: Use local development initially

## Timeline

- Project Setup: Days 1-2
- Core Services Implementation: Days 3-7
- Pipeline Orchestration: Days 8-9
- Testing & Refinement: Days 10-14

Total estimated time: 2-3 weeks for MVP completion 