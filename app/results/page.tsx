"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWallet, Candidate } from "@/context/WalletContext";
import Image from "next/image";

interface CandidateResult {
  id: number;
  name: string;
  party: string;
  voteCount: number;
  photo: string;
  percentage: number;
}

export default function Results() {
  const { winnerAddress, getAllCandidates, resultDeclared, getCandidate } =
    useWallet();
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [winner, setWinner] = useState<Candidate | null>(null);

  // Mock data - replace with actual data fetching
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch candidates data
        const candidates = await getAllCandidates();

        // Ensure the data matches the expected structure
        const mockResults: CandidateResult[] = candidates.map(
          (candidate: any) => ({
            id: candidate.id,
            name: candidate.name,
            party: candidate.party,
            voteCount: candidate.voteCount,
            photo: candidate.photo,
            percentage: 0, // Initialize percentage as 0
          })
        );

        // Calculate total votes
        const total = mockResults.reduce(
          (sum, candidate) => sum + candidate.voteCount,
          0
        );

        // Calculate percentage for each candidate
        const resultsWithPercentages = mockResults.map((candidate) => ({
          ...candidate,
          percentage: (candidate.voteCount / total) * 100,
        }));

        // Update state (assuming you're using React)
        setTotalVotes(total);
        setResults(resultsWithPercentages);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    const fetchWinner = async () => {
      try {
        if (resultDeclared) {
          if (!winnerAddress) return;
          const winner = await getCandidate(winnerAddress);
          setWinner(winner);
        }
      } catch (error) {
        console.error("Error fetching winner:", error);
      }
    };

    fetchWinner();
    fetchResults();
  }, [getAllCandidates, winnerAddress, resultDeclared, getCandidate]);

  if (!resultDeclared) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Election is in Progress</h1>
        <p className="text-muted-foreground">
          Results will be available once the election process will end.
        </p>
      </div>
    );
  }

  return (
    resultDeclared && (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Election Results
            </h1>
            <p className="text-xl text-muted-foreground">
              Total Votes Cast: {totalVotes}
            </p>
          </div>

          {winner && (
            <Card className="mb-8 bg-primary/5 border-primary">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Winner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={winner.photo!}
                      alt={winner.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{winner.name}</h2>
                    <p className="text-xl text-primary">
                      {winner.voteCount} votes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {results.map((candidate, index) => (
              <Card key={candidate.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={candidate.photo}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {candidate.name}
                      </h3>
                      <p className="text-muted-foreground">{candidate.party}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {candidate.voteCount}
                      </p>
                      <p className="text-muted-foreground">votes</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={candidate.percentage} className="h-2" />
                    <p className="text-sm text-muted-foreground text-right">
                      {candidate.percentage.toFixed(1)}% of total votes
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
