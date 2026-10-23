import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { validateMovie } from "@/models/Movie";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  if (all && !(await isAdmin())) return NextResponse.json({error:"Unauthorized."},{status:401});
  try {
    const filter = all ? {} : {status:"published"};
    const docs = await (await getDb()).collection("movies").find(filter).sort({createdAt:-1}).limit(200).toArray();
    return NextResponse.json({movies:docs.map(m=>({...m,id:String(m._id),_id:undefined}))});
  } catch (e) {
    console.error(e); return NextResponse.json({error:"Database request failed."},{status:500});
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({error:"Unauthorized."},{status:401});
  try {
    const data = validateMovie(await req.json());
    const db = await getDb();
    const existing = await db.collection("movies").findOne({slug:data.slug});
    if (existing) return NextResponse.json({error:"A title with this name already exists. Change the title to make it unique."},{status:409});
    const result = await db.collection("movies").insertOne({...data,createdAt:new Date()});
    return NextResponse.json({ok:true,id:String(result.insertedId)},{status:201});
  } catch (e) {
    return NextResponse.json({error:e instanceof Error?e.message:"Could not create title."},{status:400});
  }
}
