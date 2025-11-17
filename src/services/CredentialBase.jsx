import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xwdflurbkiydmcalkauu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZGZsdXJia2l5ZG1jYWxrYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1MzU0NywiZXhwIjoyMDc4NjI5NTQ3fQ.W0VwEj5owETfAlvyKFGLsZFmOj417RHOP35S8l9uq5w";

export const Supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);