import Link from "next/link";

export default function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "ATOZ CINEMAS";
  const tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || "YOUR MOVIE PARADISE";
  return (
    <header className="site-header">
      <div className="header-top wrap">
        <Link href="/" className="brand" aria-label={siteName}>
          <span className="brand-icon">▣</span>
          <span className="brand-copy"><strong>{siteName}</strong><small>{tagline}</small></span>
        </Link>
        <form action="/" className="search">
          <input name="q" placeholder="Search movies..." aria-label="Search movies" />
          <button aria-label="Search">⌕</button>
        </form>
      </div>
      <nav className="nav wrap">
        <Link href="/" className="nav-active">Home</Link>
        <Link href="/?type=movie">Movies</Link>
        <Link href="/?type=series">Series</Link>
      </nav>
    </header>
  );
}
