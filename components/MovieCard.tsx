import Link from "next/link";

type Props = {
  movie: {
    title: string; slug: string; type: "movie" | "series"; poster: string;
    year: number | null; language?: string; genre?: string;
  };
};

export default function MovieCard({ movie }: Props) {
  return (
    <article className="movie-card">
      <Link href={`/title/${movie.slug}`} className="poster-link">
        {/* Remote poster URLs are entered by the admin; plain img avoids Next image host configuration. */}
        <img className="poster" src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        <span className={`badge type-badge ${movie.type}`}>{movie.type === "series" ? "TV SHOW" : "MOVIE"}</span>
      </Link>
      <div className="card-copy">
        <Link href={`/title/${movie.slug}`} className="card-title">{movie.title}</Link>
        <p className="card-meta">{movie.year || "Year not set"}{movie.language ? ` · ${movie.language}` : ""}</p>
      </div>
    </article>
  );
}
