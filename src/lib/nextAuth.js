// import CredentialsProvider from "next-auth/providers/credentials";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "@/config/firebase";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing email or password");
//         }

//         try {
//           const userCredential = await signInWithEmailAndPassword(
//             auth,
//             credentials.email,
//             credentials.password,
//           );

//           console.log("Firebase login successful:", userCredential.user.uid);

//           const userDoc = await getDoc(
//             doc(db, "users", userCredential.user.uid),
//           );
//           const userData = userDoc.data();
//           if (!userDoc.exists()) {
//       // إنشاء يوزر جديد في Firestore لو مش موجود
//       await setDoc(doc(db, "users", userCredential.user.uid), {
//         email: userCredential.user.email,
//         name: userCredential.user.displayName || "No Name",
//         role: "freelancer",
//         profileImage: "/default--avatar.avif",
//       });
//             userData = { name: userCredential.user.displayName || "No Name", role: "freelancer" };

//           console.log("User data from Firestore:", userData);
//           return {
//             id: userCredential.user.uid,
//             email: userCredential.user.email,
//             name: userData?.name || userCredential.user.displayName,
//             role: userData?.role || "freelancer",
//           };
//         catch (error) {
//           let message = "Unknown error";
//           if (error.code === "auth/user-not-found") {
//             message = "User not found";
//           } else if (error.code === "auth/wrong-password") {
//             message = "Incorrect password";
//           } else if (error.code === "auth/invalid-credential") {
//             message = "Invalid email or password";
//           } else if (error.message) {
//             message = error.message;
//           }
//           throw new Error(message);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 1 * 24 * 60 * 60, // 1 day
//   },
//   jwt: {
//     // jwt encodein and decodeing config
//     // لو عايز اتحكم ف مين الرول المسموح له بدخول كذا عن طريق الرول بتاعته
//   },
//   // callbacks: {
//   //   // signin , session, callbacks دي بتحكم ف اليوزر اني ابعته اشعار مثلا انه دخل خلاص يعني كل حاجه ممكن اعملها وهو لوج ان
//   //   // callbcks هنا اقدر ازود معلومات عن اليوزر اللي داخل اضيف ع السيشن اللي دخل بيها داتا اضافيه
//   // },
//   // كدا  مش هيعمل راندوم كي بل هيستخدم اللي انا مدهوله
//   // secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login", // custom sign in page
//   },
// };

import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password,
          );
          console.log("Firebase login successful:", userCredential.user.uid);

          const userDocRef = doc(db, "users", userCredential.user.uid);
          const userDoc = await getDoc(userDocRef);
          let userData = userDoc.data();

          if (!userDoc.exists()) {
            // إنشاء يوزر جديد في Firestore لو مش موجود
            await setDoc(userDocRef, {
              email: userCredential.user.email,
              name: userCredential.user.displayName || "No Name",
              role: "freelancer",
              profileImage: "/default--avatar.avif",
            });
            console.log(
              "New user created in Firestore:",
              userCredential.user.uid,
            );
            userData = {
              name: userCredential.user.displayName || "No Name",
              role: "freelancer",
              profileImage: "/default--avatar.avif",
            };
          }

          console.log("User data from Firestore:", userData);

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name:
              userData?.name || userCredential.user.displayName || "No Name",
            role: userData?.role || "freelancer",
          };
        } catch (error) {
          let message = "Unknown error";
          if (error.code === "auth/user-not-found") {
            message = "User not found";
          } else if (error.code === "auth/wrong-password") {
            message = "Incorrect password";
          } else if (error.code === "auth/invalid-credential") {
            message = "Invalid email or password";
          } else if (error.message) {
            message = error.message;
          }
          console.error("Login error:", error);
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/login",
  },
};
