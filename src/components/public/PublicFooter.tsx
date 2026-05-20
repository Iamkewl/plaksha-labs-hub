import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built for{" "}
            <span className="text-foreground font-medium">Plaksha University</span>
          </p>
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            <Link
              href="/labs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Explore Labs
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
