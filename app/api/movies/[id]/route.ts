import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { validateMovie } from "@/models/Movie";

export const runtime = "nodejs";

function validId(id:string){return ObjectId.isValid(id)&&new ObjectId(id).toHexString()===id.toLowerCase();}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}) {
  if (!(await isAdmin())) return NextResponse.json({error:"Unauthorized."},{status:401});
  const {id}=await params;
  if(!validId(id)) return NextResponse.json({error:"Invalid title ID."},{status:400});
  try{
    const data=validateMovie(await req.json());const db=await getDb();const _id=new ObjectId(id);
    const duplicate=await db.collection("movies").findOne({slug:data.slug,_id:{$ne:_id}});
    if(duplicate)return NextResponse.json({error:"Another title already uses this name."},{status:409});
    const result=await db.collection("movies").updateOne({_id},{$set:data});
    if(!result.matchedCount)return NextResponse.json({error:"Title not found."},{status:404});
    return NextResponse.json({ok:true});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Could not update title."},{status:400});}
}

export async function DELETE(_req:Request,{params}:{params:Promise<{id:string}>}) {
  if (!(await isAdmin())) return NextResponse.json({error:"Unauthorized."},{status:401});
  const {id}=await params;if(!validId(id))return NextResponse.json({error:"Invalid title ID."},{status:400});
  try{const result=await (await getDb()).collection("movies").deleteOne({_id:new ObjectId(id)});if(!result.deletedCount)return NextResponse.json({error:"Title not found."},{status:404});return NextResponse.json({ok:true});}
  catch{return NextResponse.json({error:"Database delete failed."},{status:500});}
}
