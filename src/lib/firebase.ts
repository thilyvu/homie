"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCWv5bar_MzYhHsDQkba0OLQWx57_to6Iw",
  authDomain: "homies-coffee.firebaseapp.com",
  projectId: "homies-coffee",
  storageBucket: "homies-coffee.firebasestorage.app",
  messagingSenderId: "548062341032",
  appId: "1:548062341032:web:9ad5cb30410e5cfc089f9d",
  measurementId: "G-DWWZWP9646",
};

export const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);

export function initAnalytics() {
  void isSupported().then((supported) => {
    if (supported) getAnalytics(firebaseApp);
  });
}
