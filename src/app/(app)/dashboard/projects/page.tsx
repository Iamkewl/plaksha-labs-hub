import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getProjects } from "@/app/actions/projects";
import { Plus, FolderKanban, Users, FileText, Globe, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let fetchError = false;

  try {
    projects = await getProjects();
  } catch {
    fetchError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage team projects and Bills of Materials
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {fetchError ? (
        <Card>
          <CardContent className="pt-12">
            <EmptyState
              icon={FolderKanban}
              title="Could not load projects"
              description="There was a problem fetching your projects. Please try again later."
            />
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to start managing BOMs and material requests"
              action={{
                label: "Create Project",
                href: "/projects/new",
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const memberCount = project.members.length;
            const mentorName = project.mentor
              ? (project.mentor.name ?? project.mentor.email)
              : null;
            const bomCount = project._count.boms;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight truncate">
                        {project.name}
                      </CardTitle>
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
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {project.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>
                        <span className="font-medium">{memberCount}</span> member
                        {memberCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {mentorName && (
                      <p className="text-xs text-muted-foreground">
                        Mentor: {mentorName}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge variant="outline" className="text-xs gap-1">
                        <FileText className="h-3 w-3" />
                        {bomCount} BOM
                        {bomCount !== 1 ? "s" : ""}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
