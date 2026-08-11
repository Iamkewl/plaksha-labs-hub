import { requireAuth } from "@/lib/auth-guard";
import { getProjects } from "@/app/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderKanban, FlaskConical, Globe, Lock, Plus, Users } from "lucide-react";
import Link from "next/link";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function ProjectsPage() {
  await requireAuth();
  const projects = await getProjects();

  return (
    <div>
      <ReactiveReveal className="flex items-center justify-between gap-3" translateY={0.35}>
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Team projects and Bills of Materials</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </ReactiveReveal>

      {projects.length === 0 ? (
        <ReactiveReveal delay={0.08} translateY={0.45}>
          <EmptyState
            className="mt-16"
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start managing BOMs, material requests, and team progress."
            primaryAction={{
              label: "Create your first project",
              href: "/projects/new",
              icon: Plus,
            }}
            secondaryAction={{
              label: "Tour a sample project",
              href: "/demo",
              icon: FlaskConical,
              variant: "outline",
            }}
            footer={
              <>
                Tip: try the demo to see a fully-populated project with team,
                BOM, and milestones — no signup required.
              </>
            }
          />
        </ReactiveReveal>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const lead = project.members.find((m) => m.role === "LEAD");
            return (
              <ReactiveReveal key={project.id} delay={0.06 + index * 0.03} translateY={0.4}>
                <Link href={`/projects/${project.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                        <FolderKanban className="h-5 w-5 shrink-0 text-muted-foreground" />
                      </div>
                      <Badge variant="secondary" className="w-fit gap-1">
                        {project.isPublic ? (
                          <>
                            <Globe className="h-3.5 w-3.5" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            Private
                          </>
                        )}
                      </Badge>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          <ReactiveMetric value={project.members.length} className="font-medium" /> member
                          {project.members.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {project.mentor && (
                        <p className="text-xs text-muted-foreground">
                          Mentor: {project.mentor.name ?? project.mentor.email}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          <ReactiveMetric value={project._count.boms} /> BOM
                          {project._count.boms !== 1 ? "s" : ""}
                        </Badge>
                        {lead && (
                          <span className="text-xs text-muted-foreground">
                            Lead: {lead.user.name ?? lead.user.email}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ReactiveReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
