import { getDb } from "@/lib/mongodb";
import MovieCard from "@/components/MovieCard";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; type?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 100);
  const type = params.type === "movie" || params.type === "series" ? params.type : "";
  let movies: any[] = [];
  try {
    const db = await getDb();
    const filter: Record<string, any> = { status: "published" };
    if (type) filter.type = type;
    if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    movies = await db.collection("movies").find(filter).sort({ createdAt: -1 }).limit(60).toArray();
  } catch (error) {
    console.error("Homepage database query failed:", error);
  }

  return <main className="main wrap">
    <h1 className="section-title"><span className="bolt">ϟ</span>{q ? `Search: ${q}` : type === "movie" ? "Movies" : type === "series" ? "Web Series" : "Latest Releases"}</h1>
    {movies.length ? <div className="movie-grid">{movies.map((m) => <MovieCard key={String(m._id)} movie={{title:m.title,slug:m.slug,type:m.type,poster:m.poster,year:m.year,language:m.language,genre:m.genre}} />)}</div>
    : <div className="empty">{q ? "No published titles matched your search." : "No titles published yet. Sign in to /admin and add your first movie or series."}</div>}
  </main>;
}
