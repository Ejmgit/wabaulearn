"use client";

import { useParams } from "next/navigation";
import React from "react";

function BloggerDetails() {
  const params = useParams();

  console.log(params);
  return (
    <div>
      <h1 className="text-white text-4xl font-bold">Details</h1>
    </div>
  );
}

export default BloggerDetails;
