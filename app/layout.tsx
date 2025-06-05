"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Vote } from "lucide-react";
import { WalletProvider } from "@/context/WalletContext";
import { useWallet } from "@/context/WalletContext";
import {
  ConnectButton,
  ThirdwebProvider,
  useDisconnect,
  useActiveWallet,
} from "thirdweb/react";
import { client } from "./blockchain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

function Navigation() {
  const {
    isConnected,
    isCommissioner,
    registrationActive,
    startRegistration,
    stopRegistration,
    votingActive,
    startVoting,
    stopVoting,
    declareWinner,
    resultDeclared,
  } = useWallet();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  return (
    <header className="border-b">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Vote className="h-6 w-6" />
            <span className="font-semibold text-xl">DVote</span>
          </Link>
          <div className="flex items-center gap-6">
            {isConnected ? (
              <>
                {isCommissioner && !resultDeclared ? (
                  <>
                    {registrationActive ? (
                      <Button onClick={stopRegistration}>
                        Stop Registration
                      </Button>
                    ) : (
                      <Button onClick={startRegistration}>
                        Start Registration
                      </Button>
                    )}
                    {!registrationActive && !votingActive && (
                      <Button onClick={startVoting}>Start Voting</Button>
                    )}
                    {votingActive && (
                      <Button onClick={stopVoting}>Stop Voting</Button>
                    )}
                    {!registrationActive && !votingActive && (
                      <Button onClick={declareWinner}>Declare Winner</Button>
                    )}
                  </>
                ) : (
                  <>
                    {!resultDeclared && (
                      <>
                        <Link
                          href="/register"
                          className="hover:text-primary transition-colors"
                        >
                          Register to Vote
                        </Link>
                        <Link
                          href="/candidates/register"
                          className="hover:text-primary transition-colors"
                        >
                          Run as Candidate
                        </Link>
                        <Link
                          href="/candidates"
                          className="hover:text-primary transition-colors"
                        >
                          View Candidates
                        </Link>
                        <Link
                          href="/vote"
                          className="hover:text-primary transition-colors"
                        >
                          Vote
                        </Link>
                      </>
                    )}
                    <Link
                      href="/profile"
                      className="hover:text-primary transition-colors"
                    >
                      Voter Profile
                    </Link>
                    <Link
                      href="/results"
                      className="hover:text-primary transition-colors"
                    >
                      Results
                    </Link>
                  </>
                )}
                <Button
                  onClick={() => {
                    disconnect(wallet!);
                  }}
                  variant="destructive"
                  className="hover:text-red transition-colors"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <ConnectButton client={client} />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
            <WalletProvider>
              <Navigation />
              <main className="flex-grow">{children}</main>
              <footer className="border-t mt-auto">
                <div className="container mx-auto px-6 py-8">
                  <div className="text-center text-muted-foreground">
                    © {new Date().getFullYear()} DVote. All rights reserved.
                  </div>
                </div>
              </footer>
              <Toaster />
            </WalletProvider>
          </ThirdwebProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
