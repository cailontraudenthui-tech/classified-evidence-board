import { useState, type FormEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Restricted Access · Archive 07' },
      { name: 'description', content: 'A sealed case archive awaits authorized access.' },
    ],
  }),
  component: AccessGate,
})

function AccessGate() {
  const [password, setPassword] = useState('')
  const [denied, setDenied] = useState(false)
  const navigate = useNavigate()

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password === '1301') {
      sessionStorage.setItem('case-access', 'granted')
      void navigate({ to: '/evidence' })
      return
    }
    setDenied(true)
    setPassword('')
  }

  return (
    <main className="access-screen relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      <div className="grain-layer" aria-hidden="true" />
      <section className="access-card relative z-10 w-full max-w-md border border-foreground/10 px-7 py-10 text-center sm:px-12 sm:py-14">
        <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 text-primary">
          <span className="font-mono text-lg">07</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-muted-foreground">Restricted archive · 2000</p>
        <h1 className="mt-5 font-serif text-4xl font-medium tracking-[0.06em] text-foreground sm:text-5xl">CLASSIFIED</h1>
        <p className="mt-4 text-sm tracking-wide text-muted-foreground">Authorization is required to continue.</p>
        <form onSubmit={unlock} className="mt-10 space-y-4 text-left">
          <label htmlFor="archive-password" className="block font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Access code</label>
          <input
            id="archive-password"
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setDenied(false) }}
            autoComplete="off"
            aria-label="Access code"
            aria-describedby={denied ? 'access-error' : undefined}
            className="h-12 w-full border border-foreground/15 bg-background/30 px-4 font-mono tracking-[0.35em] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
            placeholder="••••"
          />
          {denied && <p id="access-error" role="alert" className="font-mono text-xs tracking-[0.2em] text-primary">ACCESS DENIED</p>}
          <button type="submit" className="group flex h-12 w-full items-center justify-between border border-primary/70 bg-primary px-5 font-mono text-xs tracking-[0.25em] text-primary-foreground transition hover:bg-primary/85 active:scale-[0.99]">
            <span>UNLOCK</span><span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </button>
        </form>
        <div className="mt-10 flex items-center justify-center gap-2 text-[9px] font-mono uppercase tracking-[0.22em] text-muted-foreground/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Secure terminal · monitored
        </div>
      </section>
      <span className="absolute bottom-7 left-0 right-0 text-center font-mono text-[9px] tracking-[0.25em] text-muted-foreground/50">NO UNAUTHORIZED ACCESS</span>
    </main>
  )
}
