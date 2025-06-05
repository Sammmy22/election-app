"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useWallet, Candidate } from "@/context/WalletContext";
import { useState, useEffect } from "react";

// Mock data - replace with actual data fetching
// const candidates = [
//   {
//     id: 1,
//     name: "Jane Smith",
//     party: "Progressive Party",
//     position: "President",
//     biography: "20+ years of public service experience...",
//     manifesto: "Fighting for economic equality and social justice...",
//     photo:
//       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
//   },
//   {
//     id: 2,
//     name: "John Davis",
//     party: "Reform Alliance",
//     position: "President",
//     biography: "Former state governor with proven leadership...",
//     manifesto: "Building a stronger and more prosperous future...",
//     photo:
//       "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
//   },
// ];

export default function Candidates() {
  const { getAllCandidates } = useWallet(); // Fetch function from context
  const [candidates, setCandidates] = useState<Candidate[] | []>([]); // State to store candidates
  const [loading, setLoading] = useState(true); // State to show loading indicator

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getAllCandidates(); // Fetch candidates
        setCandidates(data); // Update state with fetched candidates
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchCandidates();
  }, [getAllCandidates]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-2xl font-bold">No Candidates Found</h1>
        <p className="text-muted-foreground">
          There are currently no candidates available for this election.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Election Candidates
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn about the candidates running in the current election
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={candidate.photo!}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {candidate.party}
                  </CardDescription>
                  <p className="text-primary font-medium mt-1">
                    Running for: {candidate.position}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Biography</h3>
                  <p className="text-muted-foreground">{candidate.biography}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Election Manifesto</h3>
                  <p className="text-muted-foreground">{candidate.manifesto}</p>
                </div>
                <Link href={`/candidates/${candidate.candidateAddress}`}>
                  <Button className="w-full">View Full Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
