// app/companies/[companyId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import ProfileViewCom from "@/components/ProfileViewCom";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CompanyPublicProfile({ params }) {
  const { companyId } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", companyId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchUser();
  }, [companyId]);

  if (loading) return <p className="text-center py-8">جارٍ التحميل...</p>;
  if (!userData) return <div className="text-center py-8">الملف غير موجود</div>;

  if (userData.role === "company") {
    return <ProfileViewCom companyIdFromProp={companyId} readonly={true} />;
  } else {
    return <div className="text-center py-8">هذا الحساب ليس شركة</div>;
  }
}
