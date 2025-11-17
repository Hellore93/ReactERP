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

  //   signUp: async (email, password) => {
  //     const { user, session, error } = await Supabase.auth.signUp({
  //       email,
  //       password,
  //     });
  //     if (error) throw error;
  //     return { user, session };
  //   },

  logout: async () => {
    try {
      await Supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  },

  getUser: () => {
    return Supabase.auth.getUser();
  },
};

export default AuthService;
