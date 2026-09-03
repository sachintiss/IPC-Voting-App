"use client";
import { useMemo, useState } from "react";

const API_URL = "https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbxAZbTbSNNnnkwQRzLgJvzTGrHAN14L3EI3QovGFV28sGzOyt6MdkmeJwYxrsMnlk0x/exec";
const candidates = [
  { id:"aishwarya", name:"Aishwarya Mahobiya", initials:"AM" },
  { id:"avantika", name:"Avantika Kumari", initials:"AK" },
  { id:"himanshu", name:"Himanshu Lodhi", initials:"HL" },
  { id:"dhanush", name:"M Dhanush", initials:"MD" },
  { id:"pranav", name:"Pranav Rajendra Dande", initials:"PD" }
];
const preferences = [
  {key:"first", short:"1st", label:"1st Preference"},
  {key:"second", short:"2nd", label:"2nd Preference"},
  {key:"third", short:"3rd", label:"3rd Preference"},
  {key:"fourth", short:"4th", label:"4th Preference"}
];

export default function Home(){
  const [email,setEmail]=useState("");
  const [prefs,setPrefs]=useState({first:"",second:"",third:"",fourth:""});
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const selected=useMemo(()=>new Set(Object.values(prefs).filter(Boolean)),[prefs]);
  const emailValid=/^[^\s@]+@stud\.tiss\.ac\.in$/i.test(email.trim());
  const complete=preferences.every(p=>prefs[p.key]);

  function choose(key,id){
    setError("");
    setPrefs(prev=>{
      const next={...prev};
      Object.keys(next).forEach(k=>{if(k!==key && next[k]===id) next[k]="";});
      next[key]=id;
      return next;
    });
  }
  async function submit(e){
    e.preventDefault();
    if(!emailValid) return setError("Please use your TISS student email ending in @stud.tiss.ac.in.");
    if(!complete) return setError("Please select one candidate for all four preferences.");
    if(selected.size!==4) return setError("Each candidate can only be selected once.");
    setSubmitting(true); setError("");
    try{
      await fetch(API_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({
        email:email.trim().toLowerCase(),
        first:candidates.find(c=>c.id===prefs.first)?.name,
        second:candidates.find(c=>c.id===prefs.second)?.name,
        third:candidates.find(c=>c.id===prefs.third)?.name,
        fourth:candidates.find(c=>c.id===prefs.fourth)?.name
      })});
      setSubmitted(true);
    }catch(err){setError("We could not submit your vote. Please try again.");}
    finally{setSubmitting(false);}
  }

  if(submitted) return <main className="page"><div className="watermark"/><div className="success"><img src="/tiss-watermark.svg" className="successLogo" alt=""/><div className="tissWord">TISS</div><div className="eyebrow">Junior PPG Batch · IPC Election 2026</div><div className="check">✓</div><h1>Vote recorded.</h1><p>Thank you for participating. Your ballot has been submitted for the Junior PPG IPC Election.</p></div></main>;

  return <main className="page">
    <div className="watermark" aria-hidden="true"/>
    <div className="wrap">
      <header className="header">
        <div className="identity">
          <div className="tissBadge"><span className="tree">⌁</span><span>TISS</span></div>
          <div><div className="eyebrow">Tata Institute of Social Sciences</div><div className="batch">Junior PPG Batch</div></div>
        </div>
        <div className="year">2026</div>
      </header>

      <section className="titleRow">
        <div><h1>IPC Election</h1><p>Rank four candidates in order of preference.</p></div>
        <div className="privacyTop">● Private ballot</div>
      </section>

      <form className="ballot" onSubmit={submit}>
        <div className="emailLine">
          <label htmlFor="email">TISS student email <b>*</b></label>
          <input id="email" type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("")}} placeholder="name@stud.tiss.ac.in" autoComplete="email" required />
          <span className="hint">Only @stud.tiss.ac.in accounts</span>
        </div>

        <div className="rankTitle"><div><h2>Candidate preference</h2><p>Choose one candidate for each preference. A candidate can be selected only once.</p></div><span className="counter">4 choices</span></div>

        <div className="table" role="table" aria-label="Candidate preference ranking">
          <div className="row head" role="row"><div>Candidate</div>{preferences.map(p=><div key={p.key}><strong>{p.short}</strong><small>Preference</small></div>)}</div>
          {candidates.map(c=><div className="row" role="row" key={c.id}>
            <div className="candidate"><span className="avatar">{c.initials}</span><span>{c.name}</span></div>
            {preferences.map(p=>{
              const active=prefs[p.key]===c.id; const unavailable=selected.has(c.id)&&!active;
              return <div className="cell" key={p.key}><button type="button" className={`radio ${active?"active":""} ${unavailable?"off":""}`} disabled={unavailable} onClick={()=>choose(p.key,c.id)} aria-label={`${c.name}, ${p.label}`} aria-pressed={active}>{active?"✓":""}</button></div>
            })}
          </div>)}
        </div>

        {error && <div className="error">{error}</div>}
        <div className="actions"><div className="confidential"><span>⌕</span><span>Responses are confidential and used only for election administration.</span></div><button className="submit" disabled={submitting}>{submitting?"Submitting…":"Submit vote"}<span>→</span></button></div>
      </form>
      <footer>Junior PPG Batch · IPC Election 2026</footer>
    </div>
  </main>;
}
