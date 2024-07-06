"use client";

import React from "react";
import {
  ConnectButton,
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { client } from "../app/client";
import { contract } from "../app/contract";
import { Box, Button } from "@mui/material";
import { prepareContractCall } from "thirdweb";

export default function TopBar() {
  const { mutate: sendTransaction } = useSendTransaction();
  const activeAccount = useActiveAccount();

  const { data: commissioner, isLoading } = useReadContract({
    contract,
    method: "function commissioner() view returns (address)",
    params: [],
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

  return (
    <div className="p-4 flex justify-between max-w-screen-lg mx-auto mb-2">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <p>DecentralVote</p>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {activeAccount?.address === commissioner &&
          (!votingActive ? (
            <Box>
              <Button
                variant="contained"
                sx={{
                  mr: 1,
                  backgroundColor: "green",
                  ":hover": { backgroundColor: "green" },
                }}
                onClick={() => {
                  const transaction = prepareContractCall({
                    contract,
                    method:
                      "function declareWinner() returns (string, uint256, address, uint256)",
                    params: [],
                  });
                  sendTransaction(transaction);
                }}
              >
                Declare Winner
              </Button>
              {!registrationActive ? (
                <Button
                  variant="contained"
                  sx={{
                    mr: 1,
                    backgroundColor: "#D7C358",
                    ":hover": { backgroundColor: "#D7C358" },
                  }}
                  onClick={() => {
                    const transaction = prepareContractCall({
                      contract,
                      method: "function startRegistration()",
                      params: [],
                    });
                    sendTransaction(transaction);
                  }}
                >
                  Start Registration
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    mr: 1,
                    backgroundColor: "#D7C358",
                    ":hover": { backgroundColor: "#D7C358" },
                  }}
                  onClick={() => {
                    const transaction = prepareContractCall({
                      contract,
                      method: "function stopRegistration()",
                      params: [],
                    });
                    sendTransaction(transaction);
                  }}
                >
                  Stop Registration
                </Button>
              )}
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                onClick={() => {
                  const transaction = prepareContractCall({
                    contract,
                    method: "function startVoting()",
                    params: [],
                  });
                  sendTransaction(transaction);
                }}
              >
                Start Voting
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              sx={{
                mr: 1,
                backgroundColor: "red",
                ":hover": { backgroundColor: "red" },
              }}
              onClick={() => {
                const transaction = prepareContractCall({
                  contract,
                  method: "function stopVoting()",
                  params: [],
                });
                sendTransaction(transaction);
              }}
            >
              Stop Voting
            </Button>
          ))}
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Example App",
            url: "https://example.com",
          }}
        />
      </Box>
    </div>
  );
}
