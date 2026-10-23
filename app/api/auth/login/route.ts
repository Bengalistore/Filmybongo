import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) return NextResponse.json({error:"Admin credentials are not configured."},{status:500});
    if (typeof username !== "string" || typeof password !== "string" || !safeEqual(username, expectedUser) || !safeEqual(password, expectedPass)) {
      return NextResponse.json({error:"Incorrect username or password."},{status:401});
    }
    await createSession(username);
    return NextResponse.json({ok:true});
  } catch {
    return NextResponse.json({error:"Invalid login request."},{status:400});
  }
}
