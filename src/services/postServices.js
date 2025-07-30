// ✅ src/services/firebase/postService.js

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
  query,
  orderBy,
} from "firebase/firestore";

export const createPost = async (postData) => {
  const postRef = await addDoc(collection(db, "posts"), {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: postRef.id, ...postData };
};

export const getAllPosts = async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    let createdAt = null;
    let updatedAt = null;

    if (data.createdAt?.toDate) {
      createdAt = data.createdAt.toDate().toISOString();
    } else if (typeof data.createdAt === "string") {
      createdAt = data.createdAt;
    }

    if (data.updatedAt?.toDate) {
      updatedAt = data.updatedAt.toDate().toISOString();
    } else if (typeof data.updatedAt === "string") {
      updatedAt = data.updatedAt;
    }

    return {
      id: doc.id,
      ...data,
      createdAt,
      updatedAt,
    };
  });
};

export const getPost = async (postId) => {
  const postRef = doc(db, "posts", postId);
  const snapshot = await getDoc(postRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    let createdAt = null;
    let updatedAt = null;

    if (data.createdAt?.toDate) {
      createdAt = data.createdAt.toDate().toISOString();
    } else if (typeof data.createdAt === "string") {
      createdAt = data.createdAt;
    }

    if (data.updatedAt?.toDate) {
      updatedAt = data.updatedAt.toDate().toISOString();
    } else if (typeof data.updatedAt === "string") {
      updatedAt = data.updatedAt;
    }

    return {
      id: snapshot.id,
      ...data,
      createdAt,
      updatedAt,
    };
  }
  return null;
};

export const updatePost = async (postId, updateData) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
  return { id: postId, ...updateData };
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, "posts", postId));
  return { id: postId };
};

export const subscribeToPosts = (callback) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      let createdAt = null;
      let updatedAt = null;

      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAt = data.createdAt;
      }

      if (data.updatedAt?.toDate) {
        updatedAt = data.updatedAt.toDate().toISOString();
      } else if (typeof data.updatedAt === "string") {
        updatedAt = data.updatedAt;
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      };
    });
    callback(posts);
  });
};
