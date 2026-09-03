'use client';

import { useMemo, useState, useEffect } from 'react';

const candidates = [
  { id: 'aishwarya', name: 'Aishwarya Mahobiya', initials: 'AM' },
  { id: 'avantika', name: 'Avantika Kumari', initials: 'AK' },
  { id: 'himanshu', name: 'Himanshu Lodhi', initials: 'HL' },
  { id: 'dhanush', name: 'M Dhanush', initials: 'MD' },
  { id: 'pranav', name: 'Pranav Rajendra Dande', initials: 'PD' }
];

const preferences = [
  { key: 'first', short: '1ST' },
  { key: 'second', short: '2ND' },
  { key: 'third', short: '3RD' },
  { key: 'fourth', short: '4TH' }
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [prefs, setPrefs] = useState({ first: '', second: '', third: '', fourth: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selected = useMemo(() => new Set(Object.values(prefs).filter(Boolean)), [prefs]);
  const emailValid = /^[^\s@]+@stud\.tiss\.ac\.in$/i.test(email.trim());
  const complete = preferences.every((p) => prefs[p.key]);

  function choose(prefKey, candidateId) {
    setError('');
    setPrefs((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key !== prefKey && next[key] === candidateId) next[key] = '';
      });
      next[prefKey] = candidateId;
      return next;
    });
  }

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== 'https://script.google.com' && event.origin !== 'https://script.googleusercontent.com') return;
      const data = event.data || {};
      if (data.type !== 'IPC_VOTE_RESULT') return;

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Your vote could not be recorded.');
      }
      setSubmitting(false);
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!emailValid) return setError('Please use your @stud.tiss.ac.in email address.');
    if (!complete) return setError('Please select a candidate for all four preferences.');
    if (selected.size !== 4) return setError('Each candidate can only be selected once.');

    const payload = {
      email: email.trim().toLowerCase(),
      first: candidates.find((c) => c.id === prefs.first)?.name,
      second: candidates.find((c) => c.id === prefs.second)?.name,
      third: candidates.find((c) => c.id === prefs.third)?.name,
      fourth: candidates.find((c) => c.id === prefs.fourth)?.name
    };

    setSubmitting(true);
    setError('');

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbwWHbZDU2_0fW_qAmYCtUBlFtRvc3H-9WV1QtX_zd960wl6On2v9_kuYk0YuOaDKYMI/exec';
    form.target = 'ipc-vote-response';
    form.style.display = 'none';

    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value || '';
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => form.remove(), 2000);
  }

  if (submitted) {
    return (
      <main className="page successPage">
        <div className="successCard">
          <div className="watermark small">TISS</div>
          <div className="tissWordmark">TISS</div>
          <div className="successCheck">✓</div>
          <div className="successKicker">JUNIOR PPG BATCH · IPC ELECTION 2026</div>
          <h1>Vote recorded.</h1>
          <p>Thank you for participating. Your ballot has been submitted successfully.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <iframe name="ipc-vote-response" title="Vote response" style={{ display: 'none' }} />
      <main className="page">
      <div className="watermark">TISS</div>
      <div className="shell">
        <header className="header">
          <div className="identity">
            <div className="tissLogo" aria-hidden="true"><span>TISS</span></div>
            <div>
              <div className="institution">TATA INSTITUTE OF SOCIAL SCIENCES</div>
              <div className="batch">Junior PPG Batch</div>
            </div>
          </div>
          <div className="year">2026</div>
        </header>

        <section className="intro">
          <div>
            <div className="kicker">JUNIOR PPG BATCH</div>
            <h1>IPC Election <span>2026</span></h1>
            <p>Rank four candidates in order of preference. One candidate can be selected only once.</p>
          </div>
          <div className="private"><i /> Private ballot</div>
        </section>

        <form className="ballot" onSubmit={submit}>
          <div className="emailRow">
            <label htmlFor="email">TISS student email <b>*</b></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="name@stud.tiss.ac.in"
              autoComplete="email"
              required
            />
            <small>Only @stud.tiss.ac.in accounts</small>
          </div>

          <div className="sectionTitle">
            <div>
              <h2>Candidate preference</h2>
              <p>Choose one candidate for each preference. A candidate can be selected only once.</p>
            </div>
            <span className="counter">{selected.size}/4 chosen</span>
          </div>

          <div className="table">
            <div className="row headerRow">
              <div className="candidateHead">CANDIDATE</div>
              {preferences.map((p) => <div className="prefHead" key={p.key}>{p.short}<small>Preference</small></div>)}
            </div>
            {candidates.map((candidate) => (
              <div className="row" key={candidate.id}>
                <div className="candidate">
                  <span className="avatar">{candidate.initials}</span>
                  <span>{candidate.name}</span>
                </div>
                {preferences.map((p) => {
                  const isSelected = prefs[p.key] === candidate.id;
                  const unavailable = selected.has(candidate.id) && !isSelected;
                  return (
                    <div className="cell" key={p.key}>
                      <button
                        type="button"
                        className={`radio ${isSelected ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}`}
                        disabled={unavailable}
                        onClick={() => choose(p.key, candidate.id)}
                        aria-label={`${candidate.name} — ${p.short} preference`}
                      >{isSelected ? '✓' : ''}</button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="actionRow">
            <div className="privacy"><span>⌕</span> Your response is confidential and used only for election administration.</div>
            {error && <div className="error">{error}</div>}
            <button className="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit vote'} <span>→</span></button>
          </div>
        </form>

        <footer>© 2026 Tata Institute of Social Sciences · Junior PPG Batch</footer>
      </div>
    </main>
  );
}
