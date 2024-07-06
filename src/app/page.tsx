"use client";

import CandidateCard from "@/components/CandidateCard";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";

import { prepareContractCall } from "thirdweb";
import {
  useSendTransaction,
  useReadContract,
  useActiveAccount,
} from "thirdweb/react";
import { contract } from "../app/layout";

type Candidate = {
  address: string;
  name: string;
  id: bigint;
};

export default function Home() {
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateAddress, setSelectedCandidateAddress] = useState("");
  const [voterName, setVoterName] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState(0n);

  const { data: voted, isLoading } = useReadContract({
    contract,
    method: "function voters(address) view returns (bool)",
    params: [activeAccount?.address as `0x${string}`],
  });

  const { data: votingActive, isLoading: isLoading2 } = useReadContract({
    contract,
    method: "function votingActive() view returns (bool)",
    params: [],
  });

  const { data: registrationActive, isLoading: isLoading3 } = useReadContract({
    contract,
    method: "function registrationActive() view returns (bool)",
    params: [],
  });

  const { data: voterProfile, isLoading: isLoading4 } = useReadContract({
    contract,
    method:
      "function registeredVoters(address) view returns (address voterAddress, string name, bool voted)",
    params: [activeAccount?.address as `0x${string}`],
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://ipfs.io/ipfs/QmRHkt5XxUeWJtMrxW1wTDs3GDYY91H8CGWL8WfezbeDAR"
      );
      // ipfs://QmRHkt5XxUeWJtMrxW1wTDs3GDYY91H8CGWL8WfezbeDAR
      const data = await res.json();

      setCandidates(data);
    }

    fetchData();
  }, []);

  return (
    <>
      <TopBar />

      {votingActive ? (
        voted ? (
          <h1 className="text-center">You have already voted!</h1>
        ) : (
          <h1 className="text-center">
            Voting is active! Select your candidate
          </h1>
        )
      ) : registrationActive ? (
        <h1 className="text-center">Registration is active!</h1>
      ) : (
        <h1 className="text-center">Voting is not active!</h1>
      )}

      {registrationActive ? (
        voterProfile?.[0] === "0x0000000000000000000000000000000000000000" ? (
          <div className="mt-3 p-4 flex justify-center max-w-screen-lg w-full mx-auto">
            <Box sx={{ mr: 1 }}>
              <input
                className="custom-input"
                placeholder="Enter name"
                onChange={(e) => setVoterName(e.target.value)}
                value={voterName}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                const transaction = prepareContractCall({
                  contract,
                  method: "function registerVoter(string _name)",
                  params: [voterName],
                });
                sendTransaction(transaction);
                setVoterName("");
              }}
            >
              Submit
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-center">
              Your Registration has been submitted!
            </h1>
          </>
        )
      ) : (
        <div className="mt-3 p-4 flex justify-between max-w-screen-lg w-full mx-auto">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              selected={candidate.address === selectedCandidateAddress}
              name={candidate.name}
              address={candidate.address}
              id={candidate.id}
              onClick={() => {
                setSelectedCandidateAddress(candidate.address);
                setSelectedCandidateId(candidate.id);
              }}
            />
          ))}
        </div>
      )}

      {votingActive && !registrationActive && !voted && (
        <div className="mt-3 p-4 justify-center flex mx-auto w-full">
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedCandidateAddress || !selectedCandidateId) {
                alert("Please select a candidate");
                return;
              }

              if (voted) {
                alert("You have already voted");
                setSelectedCandidateId(0n);
                setSelectedCandidateAddress("");
                return;
              }
              const transaction = prepareContractCall({
                contract,
                method: "function vote(address _candidateAddress, uint256 _id)",
                params: [
                  selectedCandidateAddress as `0x${string}`,
                  selectedCandidateId,
                ],
              });
              sendTransaction(transaction);
            }}
          >
            Cast Vote
          </Button>
        </div>
      )}
    </>
  );
}
