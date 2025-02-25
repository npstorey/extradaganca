/**
 * LLM prompt templates
 */

/**
 * Template for generating a vibe summary based on user answers
 */
export const VIBE_SUMMARY_PROMPT = `
You are a vibe architect, an AI specialized in creating personalized mood descriptions.
Based on the following 5 answers, create a cohesive "vibe" summary that captures the essence of this person's current state.

Your response should include:
1. A short, catchy title for this vibe (3-5 words)
2. A vivid description (300-500 characters) that captures the mood, aesthetic, and atmosphere

User's answers:
Question: If your current mood was a color, what would it be and why?
Answer: {answer1}

Question: What activity would make your day perfect right now?
Answer: {answer2}

Question: Name a movie, TV show, or book that matches how you feel today.
Answer: {answer3}

Question: If you could teleport anywhere for the next hour, where would you go?
Answer: {answer4}

Question: What kind of music would be the soundtrack to your current mindset?
Answer: {answer5}

Respond with JSON only in this exact format:
{
  "title": "Catchy Vibe Title",
  "description": "Vivid description of the vibe..."
}
`;

/**
 * Template for generating image prompts based on the vibe summary
 */
export const IMAGE_PROMPT_TEMPLATE = `
You are an expert AI artist specialized in creating detailed image generation prompts.
Based on the following vibe description, create 5 distinct but cohesive image prompts that visually represent this vibe.

Vibe Title: {title}
Vibe Description: {description}

Your prompts should:
1. Be detailed and specific (50-100 words each)
2. Include artistic style, mood, lighting, and composition details
3. Avoid any copyrighted characters or explicit content
4. Each capture a different aspect of the overall vibe
5. Include descriptive artistic terms like "cinematic", "golden hour lighting", etc.

Respond with JSON only in this exact format:
{
  "prompts": [
    "First detailed image prompt...",
    "Second detailed image prompt...",
    "Third detailed image prompt...",
    "Fourth detailed image prompt...",
    "Fifth detailed image prompt..."
  ]
}
`;

/**
 * Template for generating song recommendations based on the vibe
 */
export const MUSIC_RECOMMENDATION_PROMPT = `
You are a music curator AI with encyclopedic knowledge of music across all genres and eras.
Based on the following vibe description, recommend 10 specific songs that would perfectly complement this mood and aesthetic.

Vibe Title: {title}
Vibe Description: {description}

Your recommendations should:
1. Include a diverse mix of artists and eras
2. Be specific (artist name and exact song title)
3. Genuinely match the described mood
4. Include some lesser-known gems, not just the most obvious choices
5. Cover a range of energy levels within the vibe's general mood

Respond with JSON only in this exact format:
{
  "songs": [
    {"artist": "Artist Name", "title": "Song Title"},
    {"artist": "Artist Name", "title": "Song Title"},
    ...etc
  ]
}
`; 