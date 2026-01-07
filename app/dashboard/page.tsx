import { auth } from "@/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { Navbar } from "@/components/navbar";
import { Briefcase, Calendar, CheckCircle, AlertTriangle, FileText } from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "student") {
    // This shouldn't happen due to middleware protection, but as a fallback
    return null;
  }

  // Fetch real data from Firestore using Admin SDK
  const adminDb = getAdminDb();
  const userRef = adminDb.collection("users").doc(session.user.email!);
  const userSnap = await userRef.get();
  const userData = userSnap.data();

  const isProfileComplete = userData?.isProfileComplete;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={session.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <header className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, {userData?.name?.split(' ')[0]} 👋
              </h1>
              <p className="mt-2 text-slate-500">
                Track your applications and manage your placement journey.
              </p>
            </div>

            {/* Profile Check */}
            {!isProfileComplete && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 flex items-start gap-3 max-w-md shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Profile Incomplete</p>
                  <p className="text-sm text-amber-700 mt-0.5">
                    You must <a href="/profile/edit" className="font-semibold underline decoration-amber-500/50 hover:decoration-amber-600">complete your academic details</a> before applying.
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-10 animate-slide-up">
          {[
            {
              label: "Active Applications",
              value: "3",
              icon: Briefcase,
              color: "text-brand-600",
              bg: "bg-brand-50"
            },
            {
              label: "Upcoming Interviews",
              value: "1",
              icon: Calendar,
              color: "text-purple-600",
              bg: "bg-purple-50"
            },
            {
              label: "Profile Status",
              value: isProfileComplete ? "Complete" : "Incomplete",
              icon: isProfileComplete ? CheckCircle : AlertTriangle,
              color: isProfileComplete ? "text-emerald-600" : "text-amber-600",
              bg: isProfileComplete ? "bg-emerald-50" : "bg-amber-50"
            },
          ].map((stat) => (
            <div key={stat.label} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between bg-white">
            <h3 className="text-lg font-bold text-slate-800">Latest Drives</h3>
            <button className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">View All</button>
          </div>

          {/* Empty State / Placeholder */}
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">No active drives yet</h4>
            <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
              New placement drives will appear here once companies start visiting.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}