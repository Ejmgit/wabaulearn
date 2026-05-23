"use client";

import { supabase1 } from "@/Config/Supabase";
import { createContext, useEffect, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [quotes, setQuotes] = useState([]);

  // fetch quotes
  const fetchQts = async () => {
    const { data, error } = await supabase1.from("Quotes").select("*");
    if (!error) {
      setQuotes(data);
    }
  };

  useEffect(() => {
    fetchQts();
  }, []);

  return (
    <DataContext.Provider value={{ quotes }}>{children}</DataContext.Provider>
  );
}

export default DataContext;
