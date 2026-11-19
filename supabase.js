
const SUPABASE_URL =
  "https://yahiqhqlvvpbyrgxasgi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AdBn-gQgY3l7O7qPsPdakQ_5gPAbFc8";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("AYEESHER'S COLLECTION backend connected!");
