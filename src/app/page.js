"use client"
import CampusMap from "@/components/CampusMap";
import React, { createContext, useEffect, useState } from 'react';



export default function Home() {

  // console.log(events)
  return (
    <main>
      <h1 className="text-center text-3xl text-blue-600 bg-white border-b-sky-400">Welcome to 3DGryphTour!</h1>
      <CampusMap />
    </main>
  );
}
