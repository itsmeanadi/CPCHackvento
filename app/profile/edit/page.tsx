import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { updateProfile } from "../actions";
import { Navbar } from "@/components/navbar";
import { Save, User, BookOpen, Link2 as LinkIcon } from "lucide-react";

export default async function ProfileEditPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  // Fetch existing data to pre-fill form using Admin SDK
  const adminDb = getAdminDb();
  const userRef = adminDb.collection("users").doc(session.user.email);
  const snap = await userRef.get();
  const data = snap.data() || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-slide-up">

          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Complete Your Profile</h1>
            <p className="mt-1 text-sm text-slate-500">
              Accurate details ensure you are eligible for the right companies.
            </p>
          </div>

          <form action={updateProfile} className="p-8 space-y-8">

            {/* Academic Details */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2">
                <BookOpen size={20} className="text-brand-600" />
                <h2>Academic Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
                  <select
                    name="branch"
                    defaultValue={data.branch || "CSE"}
                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 bg-slate-50/50 hover:bg-white transition-colors"
                    required
                  >
                    <option value="">Select your branch</option>
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Comm.</option>
                    <option value="MECH">Mechanical</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="CIVIL">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    step="0.01"
                    min="0"
                    max="10"
                    defaultValue={data.cgpa || 0}
                    required
                    placeholder="e.g. 8.5"
                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2">
                <User size={20} className="text-brand-600" />
                <h2>Contact Info</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={data.phone || ""}
                  required
                  placeholder="+91 98765 43210"
                  className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 bg-slate-50/50 hover:bg-white transition-colors"
                />
              </div>
            </section>

            {/* Links */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2">
                <LinkIcon size={20} className="text-brand-600" />
                <h2>Professional Links</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume Link (Drive/Dropbox)</label>
                  <input
                    type="url"
                    name="resumeUrl"
                    defaultValue={data.resumeUrl || ""}
                    required
                    placeholder="https://drive.google.com/..."
                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Ensure the link is publicly accessible (Anyone with link).</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      defaultValue={data.linkedinUrl || ""}
                      placeholder="https://linkedin.com/in/username"
                      className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 bg-slate-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub URL</label>
                    <input
                      type="url"
                      name="githubUrl"
                      defaultValue={data.githubUrl || ""}
                      placeholder="https://github.com/username"
                      className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 px-3 bg-slate-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-100">
              <a href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Cancel</a>
              <button
                type="submit"
                className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 active:translate-y-0.5"
              >
                <Save size={18} />
                Save Profile
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}