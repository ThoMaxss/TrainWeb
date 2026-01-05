"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Keep config in env to avoid hardcoding secrets in the repo
const firebaseConfig = {
  apiKey: "AIzaSyDdmOqDFEfQ1MFSaLEFqjsS9GexF_BBYFM",
  authDomain: "gorail-g16.firebaseapp.com",
  projectId: "gorail-g16",
  storageBucket: "gorail-g16.firebasestorage.app",
  messagingSenderId: "990081188688",
  appId: "1:990081188688:web:484b3b0144852d0c5ce255",
  measurementId: "G-YPQQBLZKDB"
};

// Initialize once (Next.js RSC/fast refresh safe)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);