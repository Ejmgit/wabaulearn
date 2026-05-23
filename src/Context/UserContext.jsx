"use client";

import { createContext, useEffect, useState } from "react";
import { supabase2 } from "@/Config/Supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // get authenticated user + profile
  const getUser = async () => {
    try {
      if (!navigator.onLine) return;

      // safer than getUser()
      const {
        data: { session },
      } = await supabase2.auth.getSession();

      const currentUser = session?.user;

      if (!currentUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email,
      });

      // fetch ONLY current user profile
      const { data, error } = await supabase2
        .from("profile")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error.message);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("User fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase2.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;

      if (event === "SIGNED_IN" && currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
        });

        const { data } = await supabase2
          .from("profile")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        setProfile(data || null);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        profile,
        loading,
        setUser,
        getUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
