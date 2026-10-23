import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let movie: any = null;
  try { movie = await (await getDb()).collection("movies").findOne({ slug, status: "published" }); }
  catch (e) { console.error(e); }
  if (!movie) notFound();
  return <main className="main wrap">
    <article className="detail">
      <img className="detail-poster" src={movie.poster} alt={`${movie.title} poster`} />
      <div>
        <p className="detail-meta">{movie.type === "series" ? "WEB SERIES" : "MOVIE"}{movie.year ? ` · ${movie.year}` : ""}{movie.language ? ` · ${movie.language}` : ""}</p>
        <h1>{movie.title}</h1>
        {movie.genre && <p><strong>Genre:</strong> {movie.genre}</p>}
        <p>{movie.description || "No description has been added yet."}</p>
        {movie.trailerUrl && /^https?:\/\//i.test(movie.trailerUrl) && <a className="trailer-link" href={movie.trailerUrl} target="_blank" rel="noreferrer">Watch Trailer ↗</a>}
      </div>
    </article>
  </main>;
}
