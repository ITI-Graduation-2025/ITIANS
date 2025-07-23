import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

// islam mohamed

// collectionUesr

//  setUser
export const setUser = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    ...data,
  });
};

//  getUser
export const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return "User not found";
};

//  updateUser
export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

// getAllUsers;
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();

    let createdAt = null;
    if (data.createdAt?.toDate) {
      // لو مكتوب كـ serverTimestamp() في الدوك القديم
      createdAt = data.createdAt.toDate().toISOString();
    } else if (typeof data.createdAt === "string") {
      createdAt = data.createdAt;
    }

    return {
      id: doc.id,
      ...data,
      createdAt,
    };
  });
};

// دي عشان التغير اللحظي لو حصل حاجه في ف الفايربيز بيعمل سناب شوت طول الوقت
// onSnapshot = ابعتلي الداتا أول مرة، وكل مرة تتغير
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

      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });

    callback(users);
  });
};

// companyAccount Logic

// setCompany
export const setCompany = async (email, data) => {
  await setDoc(doc(db, "companyAccount", email), {
    ...data,
    createdAt: serverTimestamp(),
    verificationStatus: "Pending",
    rating: 0,
    reviews: 0,
    stats: {
      activeJobs: 0,
      totalHires: 0,
      successRate: "0%",
    },
    specializations: [],
  });
};

// -------------------------------------------------------------------------------------------------------------------------------------------
