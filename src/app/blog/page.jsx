"use client";

import Link from "next/link";
import React from "react";

function Blogger() {
  return (
    <div>
      <div className="text-white">
        <h1 className="text-4xl text-white font-bol">Blogger</h1>
        <Link href={`blog/${"One"}`}>One</Link>
        <Link href={`blog/${"Two"}`}>Two</Link>
        <Link href={`blog/${"Three"}`}>Three</Link>
      </div>
    </div>
  );
}

export default Blogger;
