'use client';

import { useMemo, useState } from 'react';

const candidates = [
  { id: 'aishwarya', name: 'Aishwarya Mahobiya', initials: 'AM' },
  { id: 'avantika', name: 'Avantika Kumari', initials: 'AK' },
  { id: 'himanshu', name: 'Himanshu Lodhi', initials: 'HL' },
  { id: 'dhanush', name: 'M Dhanush', initials: 'MD' },
  { id: 'pranav', name: 'Pranav Rajendra Dande', initials: 'PD' }
];

const preferences = [
  { key: 'first', label: '1st Preference' },
  { key: 'second', label: '2nd Preference' },
  { key: 'third', label: '3rd Preference' },
  { key: 'fourth', label: '4th Preference' }
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

  async function submit(e) {
    e.preventDefault();
    if (submitting) return;
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

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('The server returned an unexpected response.');
      }

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Your vote could not be recorded.');
      }
    } catch (err) {
      setError('Unable to connect to the election server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="page successPage">
        <div className="bgTree left" aria-hidden="true" />
        <div className="bgTree right" aria-hidden="true" />
        <div className="successCard">
          <img className="logo small" src="/tiss-logo.png" alt="TISS" />
          <div className="successCheck">✓</div>
          <div className="successKicker">JUNIOR PPG BATCH · IPC ELECTION 2026</div>
          <h1>Vote recorded.</h1>
          <p>Thank you for participating. Your ballot has been submitted successfully.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="bgTree left" aria-hidden="true" />
      <div className="bgTree right" aria-hidden="true" />
      <div className="shell">
        <header className="intro">
          <img className="logo" src="/tiss-logo.png" alt="TISS" />
          <div className="kicker">JUNIOR PPG BATCH</div>
          <h1>IPC Election <span>2026</span></h1>
          <p>Rank four candidates in order of preference. One candidate can be selected only once.</p>
        </header>

        <form className="ballot" onSubmit={submit}>
          <section className="block">
            <div className="blockTitle">
              <span className="badge">1</span>
              <h2>Your TISS email</h2>
            </div>
            <div className="emailField">
              <span className="mailIcon">✉</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@stud.tiss.ac.in"
                autoComplete="email"
                required
              />
            </div>
            <small>Only @stud.tiss.ac.in email addresses are allowed.</small>
          </section>

          <section className="block">
            <div className="blockTitle">
              <span className="badge">2</span>
              <h2>Rank your candidates</h2>
            </div>

            <div className="table">
              <div className="row headerRow">
                <div className="candidateHead">Candidate</div>
                {preferences.map((p) => <div className="prefHead" key={p.key}>{p.label}</div>)}
              </div>
              {candidates.map((candidate) => (
                <div className="row" key={candidate.id}>
                  <div className="candidate">{candidate.name}</div>
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
                          aria-label={`${candidate.name} — ${p.label}`}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <div className="privacy"><span>🔒</span> Your vote is private and will be used only for election administration.</div>

          {error && <div className="error">{error}</div>}

          <button className="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Vote'} <span>→</span>
          </button>
        </form>

        <footer>© 2026 Tata Institute of Social Sciences · Junior PPG Batch</footer>
      </div>
    </main>
  );
}
