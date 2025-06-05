"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { prepareContractCall, readContract } from "thirdweb";
import { contract } from "@/app/blockchain";
import { toast } from "sonner";

export interface Candidate {
  id: number;
  name: string;
  candidateAddress: string;
  voteCount: number;
  otherDataUrl: string;
  party?: string;
  position?: string;
  biography?: string;
  manifesto?: string;
  photo?: string;
  experience?: string[];
  education?: string[];
  proposals?: string[];
}

export interface Voter {
  id: number;
  voterAddress: string;
  name: string;
  voted: boolean;
  birthdate: number;
  nationalID: string;
  votedTo: string;
  imgUrl: string;
}

interface WalletContextType {
  // Connection state
  isConnected: boolean;
  address: string | undefined;

  // Commissioner state
  isCommissioner: boolean;

  // Election state
  registrationActive: boolean;
  votingActive: boolean;
  winnerAddress: string | undefined;
  candidatesCount: number;
  votersCount: number;
  resultDeclared: boolean;

  // Commissioner functions
  startRegistration: () => Promise<void>;
  stopRegistration: () => Promise<void>;
  startVoting: () => Promise<void>;
  stopVoting: () => Promise<void>;
  declareWinner: () => Promise<void>;

  // Candidate functions
  addCandidate: (
    name: string,
    candidateAddress: string,
    otherDataUrl: string
  ) => Promise<void>;
  getCandidate: (address: string) => Promise<Candidate>;
  getAllCandidates: () => Promise<Candidate[]>;

  // Voter functions
  registerVoter: (
    name: string,
    birthdate: number,
    nationalID: string,
    imgUrl: string
  ) => Promise<void>;
  vote: (candidateAddress: string, candidateId: number) => Promise<void>;
  getVoterInfo: (address: string) => Promise<Voter | null>;
}
import { useRouter } from "next/navigation";
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();

  const { data: resultDeclared } = useReadContract({
    contract,
    method: "function resultDeclared() view returns (bool)",
    params: [],
  });

  const { data: commissioner } = useReadContract({
    contract,
    method: "function commissioner() view returns (address)",
    params: [],
  });

  const { data: votingActive } = useReadContract({
    contract,
    method: "function votingActive() view returns (bool)",
    params: [],
  });

  const { data: registrationActive } = useReadContract({
    contract,
    method: "function registrationActive() view returns (bool)",
    params: [],
  });

  const { data: candidatesCount } = useReadContract({
    contract,
    method: "function candidatesCount() view returns (uint256)",
    params: [],
  });

  const { data: votersCount } = useReadContract({
    contract,
    method: "function votersCount() view returns (uint256)",
    params: [],
  });

  const { data: candidateAddresses } = useReadContract({
    contract,
    method: "function getCandidateAddresses() view returns (address[])",
    params: [],
  });

  const { data: winnerData } = useReadContract({
    contract,
    method:
      "function winner() view returns (uint256 id, string name, address candidateAddress, uint256 voteCount, string otherDataUrl)",
    params: [],
  });

  const startRegistration = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function startRegistration()",
      params: [],
    });
    sendTransaction(transaction);
  };

  const stopRegistration = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function stopRegistration()",
      params: [],
    });
    sendTransaction(transaction);
  };

  const startVoting = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function startVoting()",
      params: [],
    });
    sendTransaction(transaction);
  };

  const stopVoting = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "function stopVoting()",
      params: [],
    });
    sendTransaction(transaction);
  };

  const declareWinner = async () => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function declareWinner() returns ((uint256 id, string name, address candidateAddress, uint256 voteCount, string otherDataUrl))",
      params: [],
    });
    sendTransaction(transaction);
  };

  const addCandidate = async (
    name: string,
    candidateAddress: string,
    otherDataUrl: string
  ) => {
    if (name === "" || candidateAddress === "" || otherDataUrl === "") return;

    const transaction = prepareContractCall({
      contract,
      method:
        "function addCandidate(string name, address candidateAddress, string otherDataUrl)",
      params: [name, candidateAddress, otherDataUrl],
    });
    sendTransaction(transaction);

    toast("Candidate registered successfully!", {
      description: "You are now a candidate! Redirecting in 4 seconds...",
      duration: 4000,
    });

    setTimeout(() => {
      router.push("/");
    }, 4000);
  };

  const registerVoter = async (
    name: string,
    birthdate: number,
    nationalID: string,
    imgUrl: string
  ) => {
    if (name === "" || nationalID === "" || imgUrl === "" || birthdate === 0)
      return;
    const transaction = prepareContractCall({
      contract,
      method:
        "function registerVoter(string _name, uint256 _birthdate, string _nationalID, string _imgUrl)",
      params: [name, BigInt(birthdate), nationalID, imgUrl],
    });
    sendTransaction(transaction);

    toast("Voter registered successfully!", {
      description: "You can now vote! Redirecting in 4 seconds...",
      duration: 4000,
    });

    setTimeout(() => {
      router.push("/");
    }, 4000);
  };

  const vote = async (candidateAddress: string, candidateId: number) => {
    const transaction = prepareContractCall({
      contract,
      method: "function vote(address _candidateAddress, uint256 _id)",
      params: [candidateAddress, BigInt(candidateId)],
    });
    sendTransaction(transaction);

    toast("Vote casted successfully!", {
      description: "Redirecting in 4 seconds...",
      duration: 4000,
    });

    setTimeout(() => {
      router.push("/");
    }, 4000);
  };

  const getCandidate = async (address: string): Promise<Candidate> => {
    const data = await readContract({
      contract,
      method:
        "function getCandidate(address _candidateAddress) view returns ((uint256 id, string name, address candidateAddress, uint256 voteCount, string otherDataUrl))",
      params: [address],
    });

    const candidate = {
      id: Number(data.id),
      name: data.name,
      candidateAddress: data.candidateAddress,
      voteCount: Number(data.voteCount),
      otherDataUrl: data.otherDataUrl,
    };

    try {
      // Fetch additional data from IPFS
      const ipfsResponse = await fetch(
        `https://gateway.pinata.cloud/ipfs/${candidate.otherDataUrl}`
      );
      if (ipfsResponse.ok) {
        const ipfsData = await ipfsResponse.json();

        // Merge IPFS data into the candidate object
        return {
          ...candidate,
          party: ipfsData.party,
          position: ipfsData.position,
          biography: ipfsData.biography,
          manifesto: ipfsData.manifesto,
          photo: ipfsData.photo,
          experience: ipfsData.experience,
          education: ipfsData.education,
          proposals: ipfsData.proposals,
        };
      } else {
        console.warn(
          `Failed to fetch IPFS data for ${address}:`,
          ipfsResponse.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching IPFS data for ${address}:`, error);
    }

    // Return the candidate with just blockchain data if IPFS fetch fails
    return candidate;
  };

  const winnerAddress =
    resultDeclared && winnerData ? winnerData[2] : undefined;

  const getAllCandidates = async (): Promise<Candidate[]> => {
    if (!candidateAddresses) return [];

    // Resolve all promises and return the resulting array of Candidate objects
    const candidates = await Promise.all(
      candidateAddresses.map((address) => getCandidate(address))
    );

    return candidates;
  };

  const getVoterInfo = async (address: string) => {
    const data = await readContract({
      contract,
      method:
        "function registeredVoters(address) view returns (uint256 id, address voterAddress, string name, string nationalID, uint256 birthdate, bool voted, address votedTo, string imgUrl)",
      params: [address],
    });

    return {
      id: Number(data[0]),
      voterAddress: data[1],
      name: data[2],
      nationalID: data[3],
      birthdate: Number(data[4]),
      voted: data[5],
      votedTo: data[6],
      imgUrl: data[7],
    };
  };

  return (
    <WalletContext.Provider
      value={{
        resultDeclared: !!resultDeclared,
        isConnected: activeAccount !== undefined,
        address: activeAccount?.address,
        isCommissioner: commissioner === activeAccount?.address,
        registrationActive: !!registrationActive,
        votingActive: !!votingActive,
        winnerAddress,
        candidatesCount: Number(candidatesCount),
        votersCount: Number(votersCount),
        startRegistration,
        stopRegistration,
        startVoting,
        stopVoting,
        declareWinner,
        addCandidate,
        registerVoter,
        vote,
        getCandidate,
        getAllCandidates,
        getVoterInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
