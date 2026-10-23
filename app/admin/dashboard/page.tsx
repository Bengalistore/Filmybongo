import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  let initial: any[] = [];
  try {
    initial = await (await getDb()).collection("movies").find({}).sort({updatedAt:-1}).limit(200).toArray();
  } catch(e) { console.error(e); }
  const movies = initial.map(m => ({
    id: String(m._id), title:m.title, slug:m.slug, type:m.type, poster:m.poster,
    year:m.year, language:m.language||"", genre:m.genre||"", description:m.description||"",
    trailerUrl:m.trailerUrl||"", status:m.status
  }));
  return <main className="admin-wrap"><AdminDashboard initialMovies={movies} /></main>;
}
