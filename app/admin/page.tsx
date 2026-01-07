import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();
  
  // Double-check authorization (Defense in Depth)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user} />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Placement Control Center</h1>
            <p className="text-gray-500">Manage companies, students, and notices.</p>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            + Post New Job
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900">Recent Applications</h3>
              {/* Data visualization placeholder */}
              <div className="h-40 mt-4 bg-gray-100 rounded animate-pulse"></div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900">Company Registrations</h3>
              {/* Data visualization placeholder */}
              <div className="h-40 mt-4 bg-gray-100 rounded animate-pulse"></div>
           </div>
        </div>
      </main>
    </div>
  )
}