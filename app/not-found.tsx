import Link from "next/link";
export default function NotFound() {
  return <main className="main wrap"><div className="empty"><h1>Title not found</h1><p>This title may have been removed or is not published.</p><Link className="trailer-link" href="/">Back to Home</Link></div></main>;
}
