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

// -------------------------------------------------------------------------------------------------------------------------------------------

// Posts CRUD Operations

// Create a new post
export const createPost = async (postData) => {
  try {
    const postRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: postRef.id, ...postData };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Get all posts
export const getAllPosts = async () => {
  try {
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
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

// Get a single post by ID
export const getPost = async (postId) => {
  try {
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
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, updateData) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { id: postId, ...updateData };
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    return { id: postId };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Subscribe to posts changes (real-time updates)
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
