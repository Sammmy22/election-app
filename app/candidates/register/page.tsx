"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
export default function CandidateRegistration() {
  const router = useRouter();
  const {
    isCommissioner,
    registrationActive,
    startRegistration,
    stopRegistration,
    addCandidate,
    address,
  } = useWallet();
  const [formData, setFormData] = useState({
    fullName: "",
    party: "",
    position: "",
    biography: "",
    manifesto: "",
    photo: "",
    experience: [""],
    education: [""],
    proposals: [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.fullName === "" ||
      formData.party === "" ||
      formData.position === "" ||
      formData.biography === "" ||
      formData.manifesto === "" ||
      formData.photo === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const response = await fetch("/api/upload-to-ipfs", {
      method: "POST",
      body: JSON.stringify({
        party: formData.party,
        position: formData.position,
        biography: formData.biography,
        manifesto: formData.manifesto,
        photo: formData.photo,
        experience: formData.experience,
        education: formData.education,
        proposals: formData.proposals,
      }),
    });

    const { success, hash } = await response.json();
    if (success) {
      addCandidate(formData.fullName, address!, hash);
    }
  };

  const handleArrayFieldChange = (
    field: "experience" | "education" | "proposals",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: "experience" | "education" | "proposals") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (
    field: "experience" | "education" | "proposals",
    index: number
  ) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6 py-16">
        {isCommissioner && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Commissioner Controls
                  </h2>
                  {!registrationActive ? (
                    <Button onClick={startRegistration}>
                      Start Registration
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={stopRegistration}>
                      End Registration
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Candidate Registration</CardTitle>
            <CardDescription>
              Register as a candidate for the upcoming election
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationActive ? (
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
                  <Label htmlFor="party">Political Party</Label>
                  <Input
                    id="party"
                    value={formData.party}
                    onChange={(e) =>
                      setFormData({ ...formData, party: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position Running For</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biography">Biography</Label>
                  <Textarea
                    id="biography"
                    value={formData.biography}
                    onChange={(e) =>
                      setFormData({ ...formData, biography: e.target.value })
                    }
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Election Manifesto</Label>
                  <Textarea
                    id="manifesto"
                    value={formData.manifesto}
                    onChange={(e) =>
                      setFormData({ ...formData, manifesto: e.target.value })
                    }
                    required
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Experience</Label>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={exp}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "experience",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Add experience"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayField("experience", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField("experience")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Education</Label>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={edu}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "education",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Add education"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayField("education", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField("education")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Key Proposals</Label>
                  {formData.proposals.map((proposal, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={proposal}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "proposals",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Add proposal"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayField("proposals", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField("proposals")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Proposal
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo URL</Label>
                  <Input
                    id="photo"
                    type="url"
                    value={formData.photo}
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Candidacy
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-2">
                  Registration Closed
                </h2>
                <p className="text-muted-foreground">
                  Please wait for the commissioner to start the registration
                  process.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
