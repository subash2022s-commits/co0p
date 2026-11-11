import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing live Supabase and Gemini credentials...\n');

// 1. Test Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`⚠️ Supabase response:`, error.message);
      if (error.code === '42P01') {
        console.log(`💡 Note: The 'profiles' table has not been created yet in this Supabase database. You just need to run 'supabase/migrations/001_initial_schema.sql' in your Supabase SQL Editor.`);
      }
    } else {
      console.log(`✅ Supabase connection verified successfully! Table 'profiles' is ready.`);
    }
  } catch (err) {
    console.log(`❌ Supabase test error:`, err.message);
  }
} else {
  console.log(`⚠️ Supabase credentials not found in server/.env`);
}

// 2. Test Gemini API
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

if (geminiApiKey) {
  try {
    console.log(`\n🤖 Connecting to Gemini API (${geminiModel})...`);
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: 'Respond with a short 1-line message confirming that AgroAI agriculture advisor connection is active.',
    });
    console.log(`✅ Gemini API response received:`, response.text?.trim());
  } catch (err) {
    console.log(`❌ Gemini API test error:`, err.message);
  }
} else {
  console.log(`⚠️ Gemini API key not found in server/.env`);
}

