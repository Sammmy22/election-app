"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useWallet, Candidate } from "@/context/WalletContext";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CandidateProfile() {
  const { getCandidate } = useWallet();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const params = useParams();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!params.id) return;
      const candidate = await getCandidate(params.id as string);
      setCandidate(candidate);
    };

    fetchCandidate();
  }, [getCandidate, params.id]);

  if (!candidate) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Candidate not found</h1>
        <Link href="/candidates">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <Link href="/candidates">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                <Image
                  src={candidate.photo!}
                  alt={candidate.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <p className="text-muted-foreground">{candidate.party}</p>
              <p className="text-primary font-medium mt-1">
                Running for: {candidate.position}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{candidate.biography}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Election Manifesto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{candidate.manifesto}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {candidate.experience?.map((exp, index) => (
                  <li key={index} className="text-muted-foreground">
                    {exp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {candidate.education?.map((edu, index) => (
                  <li key={index} className="text-muted-foreground">
                    {edu}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {candidate.proposals?.map((proposal, index) => (
                  <li key={index} className="text-muted-foreground">
                    {proposal}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
