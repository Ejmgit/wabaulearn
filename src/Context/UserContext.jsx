"use client";

import { supabase2 } from "@/Config/Supabase";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([]);
  const [userData, setUserdata] = useState([]);

  // filter user profile to get user data
  const getUserData = () => {
    if (user && profile?.length > 0) {
      const matched = profile?.find((item) => item?.user_id === user?.id);
      if (matched) setUserdata(matched);
    }
  };

  // get user profile data
  const getProfile = async () => {
    const { data, error } = await supabase2.from("profile").select("*");
    if (data) setProfile(data);
  };

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase2.auth.getUser();
    if (user) setUser({ id: user.id, email: user.email });
  };

  useEffect(() => {
    getUser();
    getProfile();

    // Listen for login/logout
    const { data: listener } = supabase2.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          getUser();
          getProfile();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserdata(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe(); // cleanup
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
