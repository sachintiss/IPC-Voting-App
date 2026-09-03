'use client';

import { useMemo, useState } from 'react';

const candidates = [
  { id: 'aishwarya', name: 'Aishwarya Mahobiya', initials: 'AM' },
  { id: 'avantika', name: 'Avantika Kumari', initials: 'AK' },
  { id: 'himanshu', name: 'Himanshu Lodhi', initials: 'HL' },
  { id: 'dhanush', name: 'M Dhanush', initials: 'MD' },
  { id: 'pranav', name: 'Pranav Rajendra Dande', initials: 'PD' }
];

const preferenceLabels = [
  { key: 'first', label: '1st Preference', sub: 'Your strongest choice' },
  { key: 'second', label: '2nd Preference', sub: 'Your next choice' },
  { key: 'third', label: '3rd Preference', sub: 'Your third choice' },
  { key: 'fourth', label: '4th Preference', sub: 'Your fourth choice' }
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [prefs, setPrefs] = useState({ first: '', second: '', third: '', fourth: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selected = useMemo(() => new Set(Object.values(prefs).filter(Boolean)), [prefs]);
  const allComplete = preferenceLabels.every(p => prefs[p.key]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function choose(key, candidateId) {
    setError('');
    setPrefs(prev => {
      const next = { ...prev };
      // A candidate may appear only once across the four preference positions.
      for (const k of Object.keys(next)) {
        if (k !== key && next[k] === candidateId) next[k] = '';
      }
      next[key] = candidateId;
      return next;
    });
  }

  function submit(e) {
    e.preventDefault();
    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!allComplete) {
      setError('Please select one candidate for every preference from 1st to 4th.');
      return;
    }
    if (selected.size !== 4) {
      setError('Each preference must be a different candidate.');
      return;
    }
    setError('');
    // Prototype submission. Connect this handler to a database/API for production.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="page">
        <div className="shell narrow">
          <div className="brand">
            <div className="brandMark">PPG</div>
            <div>
              <div className="eyebrow">Junior PPG Batch</div>
              <div className="brandTitle">IPC Election 2026</div>
            </div>
          </div>

          <section className="successCard">
            <div className="successIcon">✓</div>
            <div className="eyebrow">Vote recorded</div>
            <h1>Thank you for voting.</h1>
            <p>Your preference has been submitted successfully. Your response will be kept confidential and used solely for the Junior PPG IPC Election.</p>
            <div className="confirmation">
              <span>Submitted for</span>
              <strong>{email}</strong>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brandMark">PPG</div>
            <div>
              <div className="eyebrow">Junior PPG Batch</div>
              <div className="brandTitle">IPC Election 2026</div>
            </div>
          </div>
          <div className="securePill"><span>●</span> Confidential ballot</div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow accent">Student Election</div>
            <h1>Choose your representatives.<br/><em>Make your voice count.</em></h1>
            <p>Rank four candidates in order of preference. One candidate can only be selected once.</p>
          </div>
          <div className="heroNumber"><strong>04</strong><span>preferences</span></div>
        </section>

        <form onSubmit={submit} className="formCard">
          <div className="sectionHead">
            <div className="step">01</div>
            <div>
              <h2>Your email</h2>
              <p>Used only to verify one response per student.</p>
            </div>
          </div>

          <label className="fieldLabel" htmlFor="email">Email address <span>*</span></label>
          <input
            id="email"
            type="email"
            placeholder="you@institution.edu"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            required
          />

          <div className="divider" />

          <div className="sectionHead">
            <div className="step">02</div>
            <div>
              <h2>Candidate preference</h2>
              <p>Select exactly one candidate for each preference. Once chosen, a candidate becomes unavailable in the other preference levels.</p>
            </div>
          </div>

          <div className="preferenceList">
            {preferenceLabels.map((pref, index) => {
              const current = prefs[pref.key];
              return (
                <section className="preference" key={pref.key}>
                  <div className="prefHeader">
                    <div className="prefBadge">{index + 1}</div>
                    <div>
                      <h3>{pref.label}</h3>
                      <span>{pref.sub}</span>
                    </div>
                    {current && <div className="chosen">Selected</div>}
                  </div>

                  <div className="candidateGrid">
                    {candidates.map(candidate => {
                      const isCurrent = current === candidate.id;
                      const usedElsewhere = selected.has(candidate.id) && !isCurrent;
                      return (
                        <button
                          type="button"
                          key={candidate.id}
                          className={`candidate ${isCurrent ? 'selected' : ''} ${usedElsewhere ? 'disabled' : ''}`}
                          onClick={() => !usedElsewhere && choose(pref.key, candidate.id)}
                          disabled={usedElsewhere}
                          aria-pressed={isCurrent}
                        >
                          <span className="avatar">{candidate.initials}</span>
                          <span className="candidateName">{candidate.name}</span>
                          <span className="radio">{isCurrent ? '✓' : ''}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="rule">
            <span>i</span>
            <p><strong>One candidate, one preference.</strong> Selecting someone as your 1st preference automatically prevents that candidate from being selected again.</p>
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <div className="submitRow">
            <div className="privacy"><span>🔒</span><span>Your response is confidential.</span></div>
            <button className="submit" type="submit">Submit my vote <span>→</span></button>
          </div>
        </form>

        <footer>Junior PPG Batch · IPC Election 2026</footer>
      </div>
    </main>
  );
}
