import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ATOZ CINEMAS — Your Movie Paradise",
  description: "Discover movies and web series, trailers, release years and details."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<footer className="footer"><div className="wrap">© {new Date().getFullYear()} ATOZ CINEMAS · Movie information and trailers</div></footer></body></html>;
}
