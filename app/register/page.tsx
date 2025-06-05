"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/context/WalletContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    dateOfBirth: 0,
    imgUrl: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const { registerVoter, address, getVoterInfo } = useWallet();

  useEffect(() => {
    if (address) {
      getVoterInfo(address).then((voterInfo) => {
        if (voterInfo && voterInfo.id > 0) {
          setIsRegistered(true);
        }
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    registerVoter(
      formData.fullName,
      formData.dateOfBirth,
      formData.nationalId,
      formData.imgUrl
    );
    console.log(formData);
    // router.push("/");
  };

  if (isRegistered) {
    return (
      <ProtectedRoute>
        <div className="container text-center mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-center mb-2">
            You are already registered
          </h1>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Voter Registration</CardTitle>
            <CardDescription>
              Register to participate in secure decentralized voting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={
                    formData.dateOfBirth
                      ? new Date(formData.dateOfBirth * 1000)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const inputDate = e.target.value;
                    const inputTimestamp = new Date(inputDate).getTime();
                    const currentTimestamp = Date.now();

                    // Calculate age in years
                    const age =
                      (currentTimestamp - inputTimestamp) /
                      (1000 * 60 * 60 * 24 * 365.25);

                    // Validate age constraints
                    if (age < 18) {
                      alert("You must be at least 18 years old.");
                      return;
                    }

                    if (age > 99) {
                      alert("Age cannot be greater than 99 years.");
                      return;
                    }

                    // Convert to Unix timestamp and update formData
                    const unixTimestamp = Math.floor(inputTimestamp / 1000);
                    setFormData({ ...formData, dateOfBirth: unixTimestamp });
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo URL</Label>
                <Input
                  id="photo"
                  type="url"
                  value={formData.imgUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imgUrl: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Register to Vote
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
