"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {id:string;title:string;slug:string;type:"movie"|"series";poster:string;year:number|null;language:string;genre:string;description:string;trailerUrl:string;status:"published"|"draft"};
const blank = {title:"",type:"movie",poster:"",year:"",language:"",genre:"",description:"",trailerUrl:"",status:"published"};
export default function AdminDashboard({initialMovies}:{initialMovies:Item[]}) {
  const [movies,setMovies] = useState(initialMovies);
  const [form,setForm] = useState<any>(blank);
  const [editing,setEditing] = useState("");
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const router = useRouter();
  function change(key:string,value:string){setForm((f:any)=>({...f,[key]:value}));}
  function reset(){setForm(blank);setEditing("");setError("");}
  function edit(m:Item){setEditing(m.id);setForm({title:m.title,type:m.type,poster:m.poster,year:m.year??"",language:m.language,genre:m.genre,description:m.description,trailerUrl:m.trailerUrl,status:m.status});setMessage("");setError("");window.scrollTo({top:0,behavior:"smooth"});}
  async function save(e:React.FormEvent){
    e.preventDefault();setBusy(true);setMessage("");setError("");
    try{
      const payload={...form,year:form.year===""?null:Number(form.year)};
      const res=await fetch(editing?`/api/movies/${editing}`:"/api/movies",{method:editing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not save title.");
      setMessage(editing?"Title updated successfully.":"Title added successfully.");reset();router.refresh();
      const list=await fetch("/api/movies?all=1");const out=await list.json();if(list.ok)setMovies(out.movies||[]);
    }catch(e){setError(e instanceof Error?e.message:"Could not save title.");}finally{setBusy(false);}
  }
  async function remove(id:string){
    if(!window.confirm("Delete this title permanently?"))return;
    setError("");setMessage("");
    try{const res=await fetch(`/api/movies/${id}`,{method:"DELETE"});const d=await res.json();if(!res.ok)throw new Error(d.error||"Delete failed.");setMovies(m=>m.filter(x=>x.id!==id));setMessage("Title deleted.");}
    catch(e){setError(e instanceof Error?e.message:"Delete failed.");}
  }
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/admin/login");router.refresh();}
  return <div className="admin-panel">
    <div className="admin-top"><div><h1>Admin Dashboard</h1><p className="muted">Manage the ATOZ CINEMAS catalogue.</p></div><div className="admin-actions"><a className="button secondary" href="/" target="_blank">View site ↗</a><button className="button secondary" onClick={logout}>Logout</button></div></div>
    <div className="admin-actions"><span className="badge" style={{position:"static",background:"#28251e",color:"#f0ca4e"}}>Total: {movies.length}</span><span className="badge" style={{position:"static",background:"#153b2c",color:"#a7f0c7"}}>Published: {movies.filter(m=>m.status==="published").length}</span><span className="badge" style={{position:"static",background:"#292630",color:"#c9c2d4"}}>Drafts: {movies.filter(m=>m.status==="draft").length}</span></div>
    <hr style={{borderColor:"#302d35",margin:"24px 0"}} />
    <h2>{editing?"Edit title":"Add a Movie or Series"}</h2>
    {message&&<div className="notice">{message}</div>}{error&&<div className="error">{error}</div>}
    <form onSubmit={save}>
      <div className="form-grid">
        <div className="field"><label>Title *</label><input value={form.title} onChange={e=>change("title",e.target.value)} maxLength={160} required /></div>
        <div className="field"><label>Type *</label><select value={form.type} onChange={e=>change("type",e.target.value)}><option value="movie">Movie</option><option value="series">TV Show / Series</option></select></div>
        <div className="field full"><label>Poster Image URL * (http/https)</label><input type="url" value={form.poster} onChange={e=>change("poster",e.target.value)} placeholder="https://example.com/poster.jpg" required /></div>
        <div className="field"><label>Release Year</label><input type="number" min="1888" max="2100" value={form.year} onChange={e=>change("year",e.target.value)} placeholder="2026" /></div>
        <div className="field"><label>Language</label><input value={form.language} onChange={e=>change("language",e.target.value)} placeholder="Hindi, English..." /></div>
        <div className="field"><label>Genre</label><input value={form.genre} onChange={e=>change("genre",e.target.value)} placeholder="Drama, Comedy..." /></div>
        <div className="field"><label>Status</label><select value={form.status} onChange={e=>change("status",e.target.value)}><option value="published">Published</option><option value="draft">Draft</option></select></div>
        <div className="field full"><label>Description</label><textarea value={form.description} onChange={e=>change("description",e.target.value)} maxLength={5000} placeholder="Write a short synopsis..." /></div>
        <div className="field full"><label>Trailer URL (optional)</label><input type="url" value={form.trailerUrl} onChange={e=>change("trailerUrl",e.target.value)} placeholder="https://youtube.com/..." /></div>
      </div>
      <div className="admin-actions"><button className="button" disabled={busy}>{busy?"Saving…":editing?"Update title":"Add title"}</button>{editing&&<button type="button" className="button secondary" onClick={reset}>Cancel edit</button>}</div>
    </form>
    <hr style={{borderColor:"#302d35",margin:"28px 0"}} />
    <h2>All Titles</h2>
    {movies.length===0?<p className="muted">Nothing added yet.</p>:<table className="admin-list"><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>{movies.map(m=><tr key={m.id}><td>{m.title}<br/><span className="muted">{m.year||"Year n/a"}</span></td><td>{m.type}</td><td>{m.status}</td><td><button className="button secondary" onClick={()=>edit(m)}>Edit</button><button className="button danger" onClick={()=>remove(m.id)}>Delete</button></td></tr>)}</tbody></table>}
  </div>;
}
