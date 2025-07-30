// ✅ src/services/firebase/userService.js

import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// --- User CRUD Operations ---
export const setUser = async (uid, data) => {
  await setDoc(doc(db, "users", uid), { ...data });
};

export const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    const userData = { id: snapshot.id, ...snapshot.data() };
    if (userData.createdAt && typeof userData.createdAt.toDate === "function") {
      userData.createdAt = userData.createdAt.toDate().toISOString();
    }
    return userData;
  }
  return "User not found";
};

export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    let createdAt = null;
    if (data.createdAt?.toDate) {
      createdAt = data.createdAt.toDate().toISOString();
    } else if (typeof data.createdAt === "string") {
      createdAt = data.createdAt;
    }
    return { id: doc.id, ...data, createdAt };
  });
};

export const subscribeToUsers = (callback) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      let createdAt = null;
      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAt = data.createdAt;
      }
      return { id: doc.id, ...data, createdAt };
    });
    callback(users);
  });
};

// --- Company Account Logic ---
export const setCompany = async (email, data) => {
  await setDoc(doc(db, "companyAccount", email), {
    ...data,
    createdAt: serverTimestamp(),
    verificationStatus: "Pending",
    rating: 0,
    reviews: 0,
    stats: { activeJobs: 0, totalHires: 0, successRate: "0%" },
    specializations: [],
  });
};

export const getCompany = async (email) => {
  const companyRef = doc(db, "companyAccount", email);
  const snapshot = await getDoc(companyRef);
  if (snapshot.exists()) {
    const companyData = { id: snapshot.id, ...snapshot.data() };
    if (
      companyData.createdAt &&
      typeof companyData.createdAt.toDate === "function"
    ) {
      companyData.createdAt = companyData.createdAt.toDate().toISOString();
    }
    return companyData;
  }
  return "Company not found";
};
