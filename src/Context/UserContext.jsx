// "use client";

// import { createContext, useEffect, useState } from "react";
// import { supabase2 } from "@/Config/Supabase";

// const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState([]);
//   const [userData, setUserdata] = useState(null);

//   // filter user profile to get user data
//   const getUserData = () => {
//     if (user && profile?.length > 0) {
//       const matched = profile.find((item) => item?.user_id === user?.id);

//       setUserdata(matched || null);
//     }
//   };

//   // get profile
//   const getProfile = async () => {
//     try {
//       if (!navigator.onLine) return;

//       const { data, error } = await supabase2.from("profile").select("*");

//       if (error) throw error;

//       setProfile(data || []);
//     } catch (error) {
//       console.error("Profile fetch error:", error.message);
//     }
//   };

//   // get authenticated user
//   const getUser = async () => {
//     try {
//       if (!navigator.onLine) return;

//       const {
//         data: { user },
//         error,
//       } = await supabase2.auth.getUser();

//       if (error) throw error;

//       if (user) {
//         setUser({
//           id: user.id,
//           email: user.email,
//         });
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("User fetch error:", error.message);
//     }
//   };

//   useEffect(() => {
//     getUser();
//     getProfile();

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase2.auth.onAuthStateChange(async (event) => {
//       if (event === "SIGNED_IN") {
//         await getUser();
//         await getProfile();
//       }

//       if (event === "SIGNED_OUT") {
//         setUser(null);
//         setUserdata(null);
//         setProfile([]);
//       }
//     });

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     getUserData();
//   }, [user, profile]);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         userData,
//         profile,
//         getUserData,
//         setUser,
//         setUserdata,
//         getUser,
//         getProfile,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export default UserContext;

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
        .single();

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

  console.log(profile);

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
