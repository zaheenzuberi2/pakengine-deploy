// Shared Supabase client for the PakEngine Marketplace pages (browse, post-a-listing, admin moderation).
// The main app (index.html) never loads this file and stays 100% local-storage-only.
//
// The key below is the "publishable" (anon) key: it is meant to be public.
// It has no power beyond what the Row Level Security policies in
// _build/marketplace-schema.sql explicitly grant to the "anon" / "authenticated" roles.
// Never put the "secret"/service_role key anywhere in this site's code.
(function () {
  "use strict";
  var SUPABASE_URL = "https://lawbnagazemzqejquoct.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_v46AN0zGdYbV4ACMt05RXw_luyYxh4a";

  if (typeof window.supabase === "undefined") {
    console.error("Supabase client library failed to load.");
    return;
  }
  window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
