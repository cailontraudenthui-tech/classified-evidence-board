import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

type Clue = { id: string; title: string; eyebrow: string; body: string; secret?: string }

const clues: Clue[] = [
  { id: 'portrait', title: 'Unidentified subject', eyebrow: 'FILE 01 · PHOTOGRAPH', body: 'The archive contains no verified likeness. This intentionally fictional portrait panel is a replaceable image slot; add an authorized image when you are ready.' },
  { id: 'alley', title: 'North service lane', eyebrow: 'LOCATION PRINT · 01', body: 'The service lane was empty when the first photograph was logged. The second print was taken from the same angle, eleven minutes later.' },
  { id: 'hallway', title: 'Room 03 corridor', eyebrow: 'LOCATION PRINT · 02', body: 'A light was recorded at the far end of the corridor. No building on the original survey has a third room.' },
  { id: 'timeline', title: 'System timestamp', eyebrow: 'RECOVERED METADATA', body: 'This timestamp appears on every recovered copy. It does not match the archive creation date.' },
  { id: 'transcript', title: 'Interview fragment', eyebrow: 'SEALED · TRANSCRIPT B', body: 'The final line was written in a different hand.', secret: 'I KNOW YOU OPENED THE FILE. — D.' },
]

export const Route = createFileRoute('/evidence')({
  head: () => ({
    meta: [
      { title: 'Case 07 · Evidence Archive' },
      { name: 'description', content: 'A sealed archive of photographs, recovered notes, and unresolved evidence.' },
    ],
  }),
  component: EvidencePage,
})

function EvidencePage() {
  const [authorized, setAuthorized] = useState(false)
  const [selected, setSelected] = useState<Clue | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const allowed = sessionStorage.getItem('case-access') === 'granted'
    if (allowed) window.setTimeout(() => setAuthorized(true), 0)
    else void navigate({ to: '/' })
  }, [navigate])

  if (!authorized) return <main className="flex min-h-dvh items-center justify-center bg-background font-mono text-xs tracking-[0.25em] text-muted-foreground">VERIFYING ACCESS…</main>

  return (
    <main className="archive-page relative overflow-hidden">
      <div className="grain-layer" aria-hidden="true" />
      <WelcomeScreen />
      <section id="caseboard" className="case-section relative px-4 pb-20 pt-10 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <header className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
            <div><p className="font-mono text-[10px] tracking-[0.3em] text-primary">ARCHIVE 07 / EVIDENCE ROOM</p><h2 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">The open case</h2></div>
            <p className="font-mono text-[10px] leading-5 tracking-[0.15em] text-muted-foreground">STATUS: UNRESOLVED<br />VIEWER: OBSERVED</p>
          </header>
          <div className="wood-frame">
            <div className="board-surface">
              <p className="board-mark board-mark-left">PROPERTY OF ARCHIVE 07</p>
              <p className="board-mark board-mark-right">DO NOT REMOVE · 03 ITEMS MISSING</p>
              <svg className="string-map" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
                <path d="M140 150 C310 110 370 290 520 340 S750 180 875 165" />
                <path d="M155 540 C320 440 380 310 520 340 S720 465 865 540" />
                <path d="M175 160 C265 300 330 440 500 560" />
                <path d="M840 160 C730 300 690 465 520 560" />
              </svg>
              <button className="evidence-item board-alley paper-photo" onClick={() => setSelected(clues[1])} aria-label="Open North service lane evidence">
                <span className="pin" /><img src="/evidence-alley.jpg" alt="Dark, empty service lane at night" /><span className="photo-caption">NORTH SERVICE LANE · 01</span>
              </button>
              <button className="evidence-item board-hallway paper-photo" onClick={() => setSelected(clues[2])} aria-label="Open Room 03 corridor evidence">
                <span className="pin" /><img src="/evidence-hallway.jpg" alt="Dim wooden corridor with a distant light" /><span className="photo-caption">ROOM 03 · 02:09</span>
              </button>
              <button className="evidence-item board-transcript paper-note" onClick={() => setSelected(clues[4])} aria-label="Open sealed interview fragment and hidden message">
                <span className="pin" /><span className="hand-note">do not open<br />until you hear it</span><span className="redacted">████████████</span><span className="note-small">TRANSCRIPT B / SEALED</span>
              </button>
              <button className="evidence-item board-timeline paper-note" onClick={() => setSelected(clues[3])} aria-label="Open recovered timestamp">
                <span className="pin" /><span className="note-small">RECOVERED METADATA</span><strong className="timestamp">7/1/2000<br /><span>02:09</span></strong><span className="note-small">LOCAL TIME · SOURCE UNKNOWN</span>
              </button>
              <button className="evidence-item board-main-paper" onClick={() => setSelected(clues[0])} aria-label="Open unidentified subject photo file">
                <span className="pin" /><span className="case-stamp">FILE 01 <i>UNVERIFIED</i></span><span className="subject-title">UNIDENTIFIED<br />SUBJECT</span>
                <span className="portrait-slot" aria-label="Fictional replaceable portrait placeholder"><svg viewBox="0 0 160 150" role="img" aria-label="Abstract fictional silhouette placeholder"><ellipse cx="80" cy="49" rx="25" ry="31" /><path d="M28 142c2-39 20-59 52-59s50 20 52 59" /></svg><span>REPLACEABLE<br />PORTRAIT SLOT</span><i className="cross-mark cross-one" /><i className="cross-mark cross-two" /></span>
                <span className="subject-meta">NO VERIFIED LIKENESS ON FILE<br />CASE REF. 07—1301</span><span className="handwriting">who is missing?</span>
              </button>
              <span className="board-whisper">Do you remember?</span>
              <span className="board-index">07 / 31 / 10</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/80 sm:flex-row sm:justify-between">
            <span>Select any pinned item to inspect the evidence.</span><span>Location prints: Paul Lichtblau + Michael Förtsch / Unsplash</span>
          </div>
        </div>
      </section>
      {selected && <ClueDialog clue={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}

function WelcomeScreen() {
  return (
    <section className="welcome-screen relative flex min-h-[92svh] flex-col items-center justify-center px-5 py-20 text-center">
      <p className="welcome-kicker font-mono text-[9px] tracking-[0.46em] text-primary sm:text-[10px]">CASE FILE 07 · EYES ONLY</p>
      <h1 className="welcome-name mt-8 font-serif text-[clamp(3.8rem,14vw,9rem)] leading-[0.9] tracking-[0.025em] text-foreground"><span className="name-bracket">[</span>KEONHO..<span className="name-bracket">]</span></h1>
      <p className="mt-8 font-mono text-xs tracking-[0.3em] text-foreground sm:text-sm">WELCOME, INVESTIGATOR.</p>
      <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-primary sm:text-xs">THE GUISE HAS BEEN OPENED.</p>
      <p className="mt-9 font-serif text-lg italic text-muted-foreground">Your presence has been recorded.<br />You were expected.</p>
      <p className="mt-8 font-mono text-[10px] tracking-[0.18em] text-foreground/75">31/10/2000 — 03:03 AM</p>
      <a href="#caseboard" className="mt-14 border-b border-primary/60 pb-2 font-mono text-[9px] tracking-[0.24em] text-muted-foreground transition hover:text-foreground">CONTINUE TO THE EVIDENCE <span aria-hidden="true">↓</span></a>
    </section>
  )
}

function ClueDialog({ clue, onClose }: { clue: Clue; onClose: () => void }) {
  return (
    <div className="clue-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="clue-dialog relative w-full max-w-lg border border-primary/30 p-7 sm:p-10" role="dialog" aria-modal="true" aria-labelledby="clue-title">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 font-mono text-lg text-muted-foreground transition hover:text-foreground" aria-label="Close clue">×</button>
        <p className="font-mono text-[9px] tracking-[0.3em] text-primary">{clue.eyebrow}</p>
        <h3 id="clue-title" className="mt-4 font-serif text-3xl text-foreground">{clue.title}</h3>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">{clue.body}</p>
        {clue.secret && <p className="mt-8 border-l-2 border-primary px-4 py-3 font-serif text-lg italic text-foreground">{clue.secret}</p>}
        <p className="mt-8 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">CASE 07 · ACCESS LOGGED</p>
      </section>
    </div>
  )
}
