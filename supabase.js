
/* =====================================
   AYEESHER'S COLLECTION
   SUPABASE BACKEND CONNECTION
===================================== */

const SUPABASE_URL =
  "https://yahiqhqlvvpbyrgxasgi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AdBn-gQgY3l7O7qPsPdakQ_5gPAbFc8";

// Check whether Supabase library loaded
if (!window.supabase) {
  console.error("Supabase library failed to load!");
  throw new Error("Supabase library is unavailable. Check your internet connection.");
}

// Create Supabase client
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("AYEESHER'S COLLECTION backend connected!");
