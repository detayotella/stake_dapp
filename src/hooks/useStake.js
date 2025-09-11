import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { STAKE_CONTRACT_ABI, STAKE_TOKEN_ABI } from "../config/ABI";
import { parseEther } from "viem";
import { toast } from "sonner";

const useStake = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [loading, setLoading] = useState(false);
  const [totalStaked, setTotalStaked] = useState("0");
  const [currentRewardRate, setCurrentRewardRate] = useState("0");

  const fetchTotals = useCallback(async () => {
    try {
      const total = await publicClient.readContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKE_CONTRACT_ABI,
        functionName: "totalStaked",
      });

      const rate = await publicClient.readContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKE_CONTRACT_ABI,
        functionName: "currentRewardRate",
      });

      setTotalStaked(total.toString());
      setCurrentRewardRate(rate.toString());
    } catch (err) {
      console.error("Error fetching totalStaked:", err);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

  const approveAndStake = useCallback(
    async (amount) => {
      if (!address) {
        toast("Please connect your wallet");
        return;
      }

      const amountStr = typeof amount === "string" ? amount : amount.toString();
      const bigAmount = parseEther(amountStr);

      try {
        setLoading(true);

        const approveSim = await publicClient.simulateContract({
          address: import.meta.env.VITE_STAKING_TOKEN,
          abi: STAKE_TOKEN_ABI,
          functionName: "approve",
          args: [import.meta.env.VITE_STAKING_CONTRACT, bigAmount],
          account: address,
        });
        await writeContractAsync(approveSim.request);

        const stakeSim = await publicClient.simulateContract({
          address: import.meta.env.VITE_STAKING_CONTRACT,
          abi: STAKE_CONTRACT_ABI,
          functionName: "stake",
          args: [bigAmount],
          account: address,
        });
        await writeContractAsync(stakeSim.request);

        // Refresh totals after staking
        fetchTotals();
      } catch (err) {
        console.error("Staking error:", err?.shortMessage || err.message, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [address, writeContractAsync, publicClient, fetchTotals]
  );

  // Listen to all events that affect totalStaked
  useWatchContractEvent({
    address: import.meta.env.VITE_STAKING_CONTRACT,
    abi: STAKE_CONTRACT_ABI,
    eventName: "Staked",
    onLogs(logs) {
      logs.forEach((log) => {
        setTotalStaked(log.args.newTotalStaked?.toString());
        setCurrentRewardRate(log.args.currentRewardRate?.toString());
      });
    },
  });

  useWatchContractEvent({
    address: import.meta.env.VITE_STAKING_CONTRACT,
    abi: STAKE_CONTRACT_ABI,
    eventName: "Withdrawn",
    onLogs(logs) {
      logs.forEach((log) => {
        setTotalStaked(log.args.newTotalStaked?.toString());
        setCurrentRewardRate(log.args.currentRewardRate?.toString());
      });
    },
  });

  useWatchContractEvent({
    address: import.meta.env.VITE_STAKING_CONTRACT,
    abi: STAKE_CONTRACT_ABI,
    eventName: "EmergencyWithdrawn",
    onLogs(logs) {
      logs.forEach((log) => {
        setTotalStaked(log.args.newTotalStaked?.toString());
      });
    },
  });

  return { approveAndStake, loading, totalStaked, currentRewardRate };
};

export default useStake;
