"use client";

import { useContext } from "react";
import UserContext from "@/Context/UserContext";

function Cases() {
  const { profile } = useContext(UserContext);

  return <div>Cases</div>;
}

export default Cases;
