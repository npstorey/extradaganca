/**
 * Test script for verifying the Vibe Generator UI API integration
 */
import fetch from 'node-fetch';

// API configuration
const API_URL = 'http://127.0.0.1:3002';

// Sample user input for testing - using format that matches server expectations
const testUserInput = {
  question1: "Deep blue because I feel calm but introspective, like I'm floating in a vast ocean of thought.",
  question2: "Reading a good book in a cozy cafe with gentle rain outside, sipping a warm chai latte.",
  question3: "Eternal Sunshine of the Spotless Mind - bittersweet, contemplative, with moments of beauty.",
  question4: "A small bookstore in Kyoto, Japan, with wooden shelves and the scent of old books and incense.",
  question5: "Lo-fi indie with soft piano melodies and occasional ambient sounds of nature."
};

/**
 * Check if the API health endpoint is responding
 */
async function checkApiHealth() {
  console.log("Checking API health...");
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    console.log(`Health check result: ${response.status} - ${data.status}`);
    console.log(`Message: ${data.message}`);
    
    return data.status === 'ok';
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    console.error("Make sure the API server is running on port 3002");
    return false;
  }
}

/**
 * Generate a vibe using the API
 */
async function testVibeGeneration() {
  console.log("\n📡 Testing vibe generation with sample user input...");
  console.log("Sample input:", JSON.stringify(testUserInput, null, 2));
  
  try {
    const response = await fetch(`${API_URL}/generate-vibe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: testUserInput }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    const data = await response.json();
    
    // Print results
    console.log("\n✅ Vibe generated successfully!");
    console.log("\n===== VIBE RESULTS =====");
    
    if (data.vibe && data.vibe.summary) {
      console.log(`\n🌟 Title: ${data.vibe.summary.title}`);
      console.log(`\n📝 Summary: ${data.vibe.summary.description.substring(0, 150)}...`);
    }
    
    if (data.vibe && data.vibe.images && data.vibe.images.length > 0) {
      console.log("\n🖼️ Images:");
      data.vibe.images.forEach((img, i) => {
        console.log(`   Image ${i+1}: ${img.url}`);
      });
    }
    
    if (data.vibe && data.vibe.songs && data.vibe.songs.length > 0) {
      console.log("\n🎵 Recommended Songs:");
      data.vibe.songs.forEach((song, i) => {
        console.log(`   ${i+1}. "${song.title}" by ${song.artist}`);
      });
    }
    
    console.log("\n========================");
    return true;
  } catch (error) {
    console.error(`\n❌ Vibe generation failed: ${error.message}`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🧪 STARTING API INTEGRATION TESTS 🧪");
  console.log("====================================");
  
  // Check API health first
  const isHealthy = await checkApiHealth();
  
  if (isHealthy) {
    // Only test vibe generation if the API is healthy
    await testVibeGeneration();
  } else {
    console.log("\n⚠️ Skipping vibe generation test due to failed health check");
  }
  
  console.log("\n====================================");
  console.log("🧪 API INTEGRATION TESTS COMPLETE 🧪");
}

// Run the tests
runTests().catch(error => {
  console.error("Test execution error:", error);
}); 