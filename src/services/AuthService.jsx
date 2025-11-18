import { Supabase } from "./CredentialBase.jsx";

const AuthService = {
  login: async (email, password) => {
    const { user, session, error } = await Supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user, session };
  },

  logout: async () => {
    try {
      await Supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  },

  getUser: async () => {
    const {
      data: { user },
      error: userError,
    } = await Supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) return null;

    const { data: profiles, error: profileError } = await Supabase.from(
      "Profiles"
    )
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) throw profileError;
    user.profile = profiles.role;
    user.name = profiles.name;
    user.lastname = profiles.lastname;
    return user;
  },
};

export default AuthService;
