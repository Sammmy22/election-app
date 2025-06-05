"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useWallet, Voter } from "@/context/WalletContext";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function VoterProfile() {
  const { getVoterInfo, address } = useWallet();
  const [voter, setVoter] = useState<Voter | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchVoterInfo = async () => {
      try {
        const data = await getVoterInfo(address); // Fetch voter info
        setVoter(data); // Update state with fetched voter info
      } catch (error) {
        console.error("Error fetching voter info:", error);
      }
    };

    fetchVoterInfo();
  }, [address, getVoterInfo]);

  return (
    <ProtectedRoute>
      {voter && voter.id ? (
        <div className="container mx-auto px-6 py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                    <Image
                      src={voter.imgUrl}
                      alt={voter.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold">{voter.name}</h2>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vote Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {voter.voted ? (
                      <>
                        Voted to:{" "}
                        <Link
                          href={`/candidates/${voter.votedTo}`}
                          className="text-primary underline"
                        >
                          {voter.votedTo}
                        </Link>
                      </>
                    ) : (
                      "Not Voted"
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voter ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{voter.id}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voter Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{voter.voterAddress}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Birthdate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {new Date(voter.birthdate * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>National ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{voter.nationalID}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">You are not registered</h1>
          <Link href="/register">
            <Button>
              {/* <ArrowLeft className="mr-2 h-4 w-4" /> */}
              Register
            </Button>
          </Link>
        </div>
      )}
    </ProtectedRoute>
  );
}
