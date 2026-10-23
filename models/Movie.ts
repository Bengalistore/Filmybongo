import { ObjectId } from "mongodb";

export type Movie = {
  _id?: ObjectId;
  title: string;
  slug: string;
  type: "movie" | "series";
  poster: string;
  year: number | null;
  language: string;
  genre: string;
  description: string;
  trailerUrl: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
};

export function makeSlug(value: string) {
  return value.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function validateMovie(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Invalid movie data.");
  const x = input as Record<string, unknown>;
  const title = typeof x.title === "string" ? x.title.trim() : "";
  const poster = typeof x.poster === "string" ? x.poster.trim() : "";
  const description = typeof x.description === "string" ? x.description.trim() : "";
  const type = x.type === "series" ? "series" : x.type === "movie" ? "movie" : null;
  const status = x.status === "draft" ? "draft" : x.status === "published" ? "published" : null;
  if (!title || title.length > 160) throw new Error("Title is required and must be under 160 characters.");
  if (!poster || !/^https?:\/\//i.test(poster)) throw new Error("Poster must be a valid http(s) image URL.");
  if (!type || !status) throw new Error("Choose a valid type and publication status.");
  const yearRaw = Number(x.year);
  const year = Number.isInteger(yearRaw) && yearRaw >= 1888 && yearRaw <= 2100 ? yearRaw : null;
  const optional = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : "";
  return {
    title,
    slug: makeSlug(title),
    type,
    poster,
    year,
    language: optional(x.language, 80),
    genre: optional(x.genre, 120),
    description: description.slice(0, 5000),
    trailerUrl: optional(x.trailerUrl, 500),
    status,
    updatedAt: new Date()
  };
}
