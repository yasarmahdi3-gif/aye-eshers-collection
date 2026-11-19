
const SUPABASE_URL = "https://yahiqhqlvvpbyrgxasgi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_AdBn-gQgY3l7O7qPsPdakQ_5gPAbFc8";

if (!window.supabase || !window.supabase.createClient) {
  throw new Error("Supabase library did not load. Check the CDN script.");
}

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase connected:", !!window.supabaseClient.auth);
