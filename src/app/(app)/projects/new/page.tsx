import { requireAuth } from "@/lib/auth-guard";
import { getMentors } from "@/app/actions/projects";
import { createProject } from "@/app/actions/projects";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProjectPage() {
  await requireAuth();
  const mentors = await getMentors();

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mentorId = formData.get("mentorId") as string;
    const isPublic = (formData.get("isPublic") as string) === "true";

    const project = await createProject({
      name,
      description: description || undefined,
      mentorId: mentorId || undefined,
      isPublic,
    });

    redirect(`/projects/${project.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Projects
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Autonomous Robot Arm"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the project goals and scope…"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentorId">Assign Mentor (optional)</Label>
              <Select name="mentorId">
                <SelectTrigger id="mentorId">
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name ?? m.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isPublic">Project Visibility</Label>
              <div id="isPublic" className="space-y-2 rounded-md border p-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="isPublic" value="false" defaultChecked />
                  <span>Private (members only)</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="isPublic" value="true" />
                  <span>Public (shown on visitors page)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <SubmitButton
                label="Create Project"
                pendingLabel="Creating…"
                className="flex-1"
              />
              <Link href="/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
