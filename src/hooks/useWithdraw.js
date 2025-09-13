// hooks/useWithdraw.js
import { useState, useCallback, useContext } from "react";
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { STAKE_CONTRACT_ABI } from "../config/ABI";
import { parseEther, decodeEventLog } from "viem";
import { toast } from "sonner";
import { GlobalStateContext } from "../context";

const useWithdraw = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  // const [loading, setLoading] = useState(false);
  const { loading, setLoading }= useContext(GlobalStateContext);
  const [events, setEvents] = useState([]); 


  const withdraw = useCallback(
    async (amount) => {
      if (!address) {
        toast.log("Please connect your wallet");
        return;
      }

      const bigAmount = parseEther(amount.toString());

      try {
        setLoading(true);


        const { request } = await publicClient.simulateContract({
          address: import.meta.env.VITE_STAKING_CONTRACT,
          abi: STAKE_CONTRACT_ABI,
          functionName: "withdraw",
          args: [bigAmount],
          account: address,
        });

        const txHash = await writeContractAsync(request);
        console.log("Withdraw tx hash:", txHash);
      } catch (err) {
        console.error("Withdraw error:", err);
      } finally {
        setLoading(false);
      }
    },
    [address, writeContractAsync, publicClient]
  );

  
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

      console.log("Decoded Withdraw events:", decodedEvents);

      setEvents((prev) => [...prev, ...decodedEvents]);
    },
  });

  return { withdraw, loading, events };
};

export default useWithdraw;
