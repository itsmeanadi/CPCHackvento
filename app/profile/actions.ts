"use server";

import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  // 1. Extract Data
  const rawData = {
    phone: formData.get("phone") as string,
    branch: formData.get("branch") as string,
    cgpa: parseFloat(formData.get("cgpa") as string),
    resumeUrl: formData.get("resumeUrl") as string, // Ideally from Firebase Storage upload
    githubUrl: formData.get("githubUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
  };

  // 2. Validate (Basic)
  if (!rawData.phone || !rawData.branch || isNaN(rawData.cgpa)) {
    throw new Error("Missing required fields");
  }

  // 3. Update Firestore
  const userRef = doc(db, "users", session.user.email);
  
  try {
    await updateDoc(userRef, {
      ...rawData,
      isProfileComplete: true, // Flag to hide warning
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update profile.");
  }

  // 4. Revalidate & Redirect
  revalidatePath("/dashboard");
  redirect("/dashboard");
}