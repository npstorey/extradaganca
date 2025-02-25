/**
 * Simple test script for the Vibe Generator API
 * 
 * Usage: node test-vibe.js
 */

import fetch from 'node-fetch';

// Sample user input
const sampleInput = {
  userInput: {
    question1: "Deep blue because I feel calm but introspective, like I'm floating in a vast ocean of thought.",
    question2: "Reading a good book in a cozy cafe with gentle rain outside, sipping a warm chai latte.",
    question3: "Eternal Sunshine of the Spotless Mind - bittersweet, contemplative, with moments of beauty.",
    question4: "A small bookstore in Kyoto, Japan, with wooden shelves and the scent of old books and incense.",
    question5: "Lo-fi indie with soft piano melodies and occasional ambient sounds of nature."
  }
};

// API endpoint 
const API_URL = 'http://127.0.0.1:3002/generate-vibe';

// Function to test the API
async function testVibeGeneration() {
  console.log('🌈 Testing Vibe Generator API...\n');
  console.log('📝 Sending user input:');
  console.log('  Question 1:', sampleInput.userInput.question1.substring(0, 50) + '...');
  console.log('  Question 2:', sampleInput.userInput.question2.substring(0, 50) + '...');
  console.log('  Question 3:', sampleInput.userInput.question3.substring(0, 50) + '...');
  console.log('  Question 4:', sampleInput.userInput.question4.substring(0, 50) + '...');
  console.log('  Question 5:', sampleInput.userInput.question5.substring(0, 50) + '...');
  console.log('\n🔄 Sending request to API...');

  try {
    console.time('Request completed in');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleInput)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.timeEnd('Request completed in');
    
    console.log('\n✅ API Response Received!');
    console.log('\n🎨 VIBE SUMMARY:');
    console.log(`  Title: "${result.vibe.summary.title}"`);
    console.log(`  Description: "${result.vibe.summary.description}"`);
    
    console.log('\n🖼️ GENERATED IMAGES:');
    result.vibe.images.forEach((image, index) => {
      console.log(`  Image ${index + 1}: ${image.url}`);
    });

    console.log('\n🎵 RECOMMENDED SONGS:');
    result.vibe.songs.forEach((song, index) => {
      console.log(`  ${index + 1}. "${song.title}" by ${song.artist}`);
    });

    console.log('\n🔑 Request ID:', result.requestId);
    console.log('\n✨ Test completed successfully!');
    
    // If the test succeeded, provide the URL for previewing the vibe
    console.log(`\n🔗 Preview URL: http://127.0.0.1:3002/preview/${result.requestId}`);
    console.log('\nTo see full JSON output, redirect to a file: node test-vibe.js > output.json');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testVibeGeneration(); 