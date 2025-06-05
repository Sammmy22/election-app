import { ArrowRight, Vote, UserPlus, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
            Secure Decentralized Voting
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Participate in transparent and secure elections with our
            decentralized voting platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link
            href="/register"
            className="group relative rounded-2xl border p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <UserPlus className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Register to Vote</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Create your voter account and verify your identity to participate
              in elections.
            </p>
            <ArrowRight className="absolute bottom-6 right-6 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/candidates/register"
            className="group relative rounded-2xl border p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Run as Candidate</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Register as a candidate and share your vision with the voters.
            </p>
            <ArrowRight className="absolute bottom-6 right-6 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/candidates"
            className="group relative rounded-2xl border p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <Vote className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">View Candidates</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Explore registered candidates and their proposals.
            </p>
            <ArrowRight className="absolute bottom-6 right-6 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </main>
    </div>
  );
}
