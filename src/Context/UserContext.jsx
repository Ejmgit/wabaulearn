"use client";

import { createContext, useEffect, useState } from "react";
import { supabase2 } from "@/Config/Supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([]);
  const [userData, setUserdata] = useState(null);

  // filter user profile to get user data
  const getUserData = () => {
    if (user && profile?.length > 0) {
      const matched = profile.find((item) => item?.user_id === user?.id);

      setUserdata(matched || null);
    }
  };

  // get profile
  const getProfile = async () => {
    try {
      if (!navigator.onLine) return;

      const { data, error } = await supabase2.from("profile").select("*");

      if (error) throw error;

      setProfile(data || []);
    } catch (error) {
      console.error("Profile fetch error:", error.message);
    }
  };

  // get authenticated user
  const getUser = async () => {
    try {
      if (!navigator.onLine) return;

      const {
        data: { user },
        error,
      } = await supabase2.auth.getUser();

      if (error) throw error;

      if (user) {
        setUser({
          id: user.id,
          email: user.email,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("User fetch error:", error.message);
    }
  };

  useEffect(() => {
    getUser();
    getProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase2.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        await getUser();
        await getProfile();
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setUserdata(null);
        setProfile([]);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getUserData();
  }, [user, profile]);

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        profile,
        getUserData,
        setUser,
        setUserdata,
        getUser,
        getProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
