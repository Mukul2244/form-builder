import Link from "next/link";
import { ThemeToggle } from "~/components/theme-toggle";
import { ThemeColorSwitcher } from "~/components/theme-color-switcher";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-primary/10 via-background to-background dark:from-primary/10 dark:via-slate-950 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-24 h-75 w-75 rounded-full bg-primary/15 blur-3xl" />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              FB
            </span>
            <span className="text-base">Form Builder</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#showcase" className="transition hover:text-foreground">Showcase</a>
            <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
            <a href="#faq" className="transition hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeColorSwitcher />
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="hidden rounded-full border border-primary/30 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/50 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-px"
            >
              Get started
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-2 text-xs font-medium text-primary shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
            Live form builder for teams and creators
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center animate-fade-up">
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Turn any idea into a
                <span className="text-primary"> shareable form</span>
                in minutes.
              </h1>
              <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                Create polished, responsive forms with live previews, drag-and-drop fields, and instant
                submissions. Collect responses with confidence and keep everything organized in one place.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-px"
                >
                  Start building free
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-background/70 px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/50"
                >
                  View your dashboard
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span>Zero setup</span>
                <span>Shareable links</span>
                <span>Real-time responses</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-primary/30 bg-background/80 p-6 shadow-2xl shadow-primary/15 backdrop-blur">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-primary">Form pulse</p>
                      <p className="text-lg font-semibold text-foreground">Design feedback</p>
                    </div>
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                      18 new responses
                    </span>
                  </div>
                  <div className="space-y-3">
                    {["Name", "Email", "Role", "Top priority"].map((label) => (
                      <div key={label} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Share instantly with a public link
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground md:grid-cols-4">
          {["Studio teams", "Agencies", "Product research", "Community events"].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-background/70 py-4">
              {item}
            </div>
          ))}
        </div>

        <div id="features" className="grid gap-6 md:grid-cols-3 animate-fade-in">
          {[
            {
              title: "Creator-ready",
              text: "Drag, reorder, and validate fields with ease. Your forms stay consistent across every screen.",
            },
            {
              title: "Insights built-in",
              text: "Review submissions in a clean dashboard with export-ready tables and clear timestamps.",
            },
            {
              title: "Share fast",
              text: "Generate public links for clients, teammates, or participants in seconds.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-background/80 p-6 shadow-sm transition hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <div id="showcase" className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center rounded-3xl border border-primary/30 bg-linear-to-br from-primary/10 via-background to-background p-10 animate-fade-up">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">From creation to submission in 3 steps</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Build, publish, and track responses without leaving your dashboard. Everything stays in sync so you
              can iterate fast.
            </p>
            <div className="mt-6 grid gap-4">
              {["Draft your questions", "Publish with a link", "Review response analytics"].map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-background/80 p-4 text-sm text-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { title: "Smart validations", text: "Required fields, email checks, and custom logic." },
              { title: "Auto-save drafts", text: "Never lose a form configuration mid-edit." },
              { title: "Live previews", text: "See the public version while you build." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background/80 p-5 text-sm">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              quote: "We replaced three tools with one. The public links are a lifesaver for client onboarding.",
              name: "Avery Morris",
              role: "Ops Lead, Studio Y",
            },
            {
              quote: "The response table is clean and export-ready. Our team reviews submissions in minutes.",
              name: "Kofi Mensah",
              role: "Head of Research",
            },
            {
              quote: "It feels like a design tool, not a form builder. Everything is exactly where you need it.",
              name: "Lina Park",
              role: "Product Designer",
            },
          ].map((item) => (
            <div key={item.name} className="rounded-3xl border border-border bg-background/80 p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">"{item.quote}"</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div id="pricing" className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Starter",
              price: "$0",
              subtitle: "For personal forms and quick tests.",
              items: ["3 active forms", "Unlimited responses", "Public share links"],
            },
            {
              title: "Team",
              price: "$29",
              subtitle: "For teams who ship weekly.",
              items: ["Unlimited forms", "Shared dashboards", "Export to CSV"],
            },
            {
              title: "Scale",
              price: "$79",
              subtitle: "For orgs that need control.",
              items: ["Custom workflows", "Advanced permissions", "Priority support"],
            },
          ].map((plan, index) => (
            <div
              key={plan.title}
              className={`rounded-3xl border ${index === 1 ? "border-primary/40 bg-primary/10" : "border-border bg-background/80"} p-6 shadow-sm`}
            >
              <p className="text-sm font-semibold text-foreground">{plan.title}</p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{plan.price}</p>
              <p className="mt-2 text-xs text-muted-foreground">{plan.subtitle}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${index === 1 ? "bg-primary text-primary-foreground" : "border border-primary/30 text-foreground"}`}
              >
                Choose plan
              </Link>
            </div>
          ))}
        </div>

        <div id="faq" className="rounded-3xl border border-border bg-background/80 p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">Frequently asked questions</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Everything you need to know about forms, sharing, and responses.
              </p>
            </div>
            <div className="space-y-5 text-sm">
              {[
                {
                  q: "Can I share a form without login?",
                  a: "Yes. Each form can be published with a public URL for anyone to submit.",
                },
                {
                  q: "How are responses stored?",
                  a: "Submissions are saved securely with timestamps and can be reviewed in the dashboard.",
                },
                {
                  q: "Can I update a form after sharing?",
                  a: "Absolutely. New changes appear instantly for anyone opening the same link.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-border bg-background px-5 py-4">
                  <p className="font-semibold text-foreground">{item.q}</p>
                  <p className="mt-2 text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/30 bg-background/80 p-10 text-center shadow-sm animate-fade-in">
          <h2 className="text-3xl font-semibold text-foreground">Ready to launch your next form?</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Bring your workflows, applications, or research forms to life with a modern, friendly experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-px"
            >
              Create your first form
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/50"
            >
              Explore the dashboard
            </Link>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>Form Builder - Crafted for modern teams.</span>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
        </footer>
      </section>
    </main>
  );
}
