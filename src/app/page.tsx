import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicProjects } from "@/app/actions/projects";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Globe,
  GraduationCap,
  Package,
  Shield,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

export default async function HomePage() {
  let publicProjects: Awaited<ReturnType<typeof getPublicProjects>> = [];
  
  try {
    // Use Promise.race to timeout DB queries if they take too long (likely network issue)
    publicProjects = await Promise.race([
      getPublicProjects(6),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database query timeout")), 5000)
      ) as Promise<any>
    ]);
  } catch (error) {
    // Keep homepage renderable when DB is temporarily unavailable
    console.warn("Could not fetch public projects:", error instanceof Error ? error.message : error);
    publicProjects = [];
  }

  return (
    <div className="app-canvas flex min-h-screen flex-col text-foreground">
      <header className="border-b border-white/10 bg-[#11121a]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-300 text-[0.65rem] font-bold tracking-wide text-[#101220]">
              PM
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/90">
              Plaksha Makerspace Hub
            </span>
          </div>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-14 lg:pt-20">
          <p className="section-kicker">Makerspace Operating System</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-end">
            <div>
              <h1 className="text-4xl leading-[1.03] text-foreground sm:text-5xl lg:text-6xl">
                Build Boldly.
                <br />
                Coordinate Cleanly.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                A cinematic command surface for students, mentors, and admins to manage machines,
                booking workflows, BOM approvals, and public project storytelling from one system.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/auth/signin">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/makerspace-projects">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Browse Public Projects
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="surface-panel border-white/15 bg-[#171825]/75">
              <CardHeader>
                <p className="section-kicker">What Happens Here</p>
                <CardTitle className="text-2xl">Operational Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Request machine time and resources</p>
                <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Get mentor and approval support</p>
                <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Build with governed access</p>
                <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Showcase projects publicly</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <p className="section-kicker">Role Journey</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Card className="surface-panel h-full">
              <CardHeader>
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Student</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover machines, book sessions, and collaborate on team projects with structured access.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="surface-panel h-full">
              <CardHeader>
                <GraduationCap className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage availability, guide teams, and validate safe execution for advanced workflows.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="surface-panel h-full">
              <CardHeader>
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Oversee training, approvals, inventory governance, and institutional analytics.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Featured Builds</p>
              <h2 className="mt-2 text-3xl">Public Makerspace Projects</h2>
            </div>
            <Link href="/makerspace-projects">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {publicProjects.length === 0 ? (
            <Card className="surface-panel mt-6">
              <CardContent className="py-8 text-center text-muted-foreground">
                No public projects published yet.
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {publicProjects.map((project) => (
                <Card key={project.id} className="surface-panel h-full">
                  <CardHeader>
                    <CardTitle className="text-xl leading-tight">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {project.description || "No description provided yet."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {project._count.members} members
                    </p>
                    <p className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {project._count.boms} BOM{project._count.boms === 1 ? "" : "s"}
                    </p>
                    {project.mentor && <p>Mentor: {project.mentor.name ?? project.mentor.email}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <Card className="surface-panel border-primary/25 bg-gradient-to-r from-[#1a1b2c] via-[#1a1d30] to-[#232638]">
            <CardContent className="flex flex-wrap items-center justify-between gap-5 py-8">
              <div>
                <p className="section-kicker">Ready To Build</p>
                <h3 className="mt-2 text-2xl">Run your makerspace with clarity and speed.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Machine catalog, bookings, projects, mentorship, approvals, and governance in one place.
                </p>
              </div>
              <Link href="/auth/signin">
                <Button size="lg" className="gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
        © 2026 Plaksha University Makerspace Hub
      </footer>
    </div>
  );
}
