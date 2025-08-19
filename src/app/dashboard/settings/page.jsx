"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { upload } from "@/utils/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const uid = session?.user?.id;
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "users", uid));
        const data = snap.data() || {};
        setName(data.name || session?.user?.name || "");
        setPhotoURL(data.photoURL || session?.user?.image || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
      } catch (e) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid, session]);

  const initials = (name || session?.user?.email || "A")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onPickImage = async (e) => {
    try {
      const url = await upload(e);
      if (url) setPhotoURL(url);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const onSave = async () => {
    if (!uid) return;
    try {
      setSaving(true);
      await updateDoc(doc(db, "users", uid), {
        name: name || null,
        photoURL: photoURL || null,
        phone: phone || null,
        bio: bio || null,
        role: "admin",
      });
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      {loading ? (
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={photoURL || undefined} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <input type="file" accept="image/*" onChange={onPickImage} />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: square image
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="min-h-24 rounded-md border border-[var(--border)] bg-[var(--background)] p-2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div> */}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onSave}
              disabled={saving}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
