import Link from "next/link";
import { getPublicProjects } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, FileText, ArrowLeft } from "lucide-react";

export default async function MakerspaceProjectsPage() {
  let projects: Awaited<ReturnType<typeof getPublicProjects>> = [];
  try {
    // Use Promise.race to timeout DB queries if they take too long (likely network issue)
    projects = await Promise.race([
      getPublicProjects(24),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database query timeout")), 5000)
      ) as Promise<any>
    ]);
  } catch (error) {
    // Keep public listing available when DB is temporarily unavailable
    console.warn("Could not fetch public projects:", error instanceof Error ? error.message : error);
    projects = [];
  }

  return (
    <div className="app-canvas min-h-screen text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
            <p className="section-kicker mt-4">Showcase</p>
            <h1 className="mt-2 text-4xl font-semibold">Public Makerspace Projects</h1>
            <p className="mt-2 text-muted-foreground">
              Ongoing projects shared by student teams and mentors.
            </p>
          </div>
          <Link href="/auth/signin">
            <Button className="gap-2">
              <Globe className="h-4 w-4" />
              Sign In to Collaborate
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="surface-panel">
            <CardContent className="py-10 text-center text-muted-foreground">
              No public projects available yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="surface-panel h-full">
                <CardHeader>
                  <CardTitle className="text-xl leading-tight">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description || "No project description provided yet."}
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
                  {project.mentor && (
                    <p>Mentor: {project.mentor.name ?? project.mentor.email}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
