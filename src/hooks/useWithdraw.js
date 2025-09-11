// hooks/useWithdraw.js
import { useState, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { STAKE_CONTRACT_ABI } from "../config/ABI";
import { parseEther, decodeEventLog } from "viem";

const useWithdraw = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]); // store decoded events

  // Withdraw function
  const withdraw = useCallback(
    async (amount) => {
      if (!address) {
        console.log("⚠️ Please connect your wallet");
        return;
      }

      const bigAmount = parseEther(amount.toString());

      try {
        setLoading(true);

        // Simulate tx
        const { request } = await publicClient.simulateContract({
          address: import.meta.env.VITE_STAKING_CONTRACT,
          abi: STAKE_CONTRACT_ABI,
          functionName: "withdraw",
          args: [bigAmount],
          account: address,
        });

        // Send tx
        const txHash = await writeContractAsync(request);
        console.log("✅ Withdraw tx hash:", txHash);
      } catch (err) {
        console.error("❌ Withdraw error:", err);
      } finally {
        setLoading(false);
      }
    },
    [address, writeContractAsync, publicClient]
  );

  // Watch Withdrawn events and decode them
  useWatchContractEvent({
    address: import.meta.env.VITE_STAKING_CONTRACT,
    abi: STAKE_CONTRACT_ABI,
    eventName: "Withdrawn",
    onLogs(logs) {
      const decodedEvents = logs.map((log) =>
        decodeEventLog({
          abi: STAKE_CONTRACT_ABI,
          data: log.data,
          topics: log.topics,
        }).args
      );

      console.log("📢 Decoded Withdraw events:", decodedEvents);

      // Append new events to existing state
      setEvents((prev) => [...prev, ...decodedEvents]);
    },
  });

  return { withdraw, loading, events };
};

export default useWithdraw;
