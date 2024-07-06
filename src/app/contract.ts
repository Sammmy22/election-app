import { getContract, defineChain } from "thirdweb";
import { client } from "./client";
export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0xf8D0bC191668aD30DA42FB8C1CE0bDeaD1353d55",
});
