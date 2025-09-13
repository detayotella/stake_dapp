import formatToken from "../../utils/format";
import useStake from "../../hooks/useStake";
import useClaim from "../../hooks/useClaim";
import { useAccount } from "wagmi";
import { useSubgraph } from "../../hooks/useSubgraph";
import { useEffect, useState } from "react";
import UserStatCard from "./useStatCard";

function Dashboard() {
  const { address } = useAccount();
  const { loading } = useStake(); 
  const { pendingRewards } = useClaim();
  const { getUserStakes } = useSubgraph();
  const [latestStake, setLatestStake] = useState("0");

  useEffect(() => {
    const loadStake = async () => {
      if (!address) return;
      const data = await getUserStakes(address);
      if (data.stakeds.length > 0) {
        setLatestStake(data.stakeds[0].newTotalStaked);
      }
    };
    loadStake();
  }, [address]);

  const formattedStake = formatToken(latestStake);

  return (
    <section>
      <h2 className="text-[var(--text-color)] text-2xl font-bold mb-4 px-2">
        Your Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UserStatCard
          label="Current Stake"
          value={loading ? "Loading..." : <span>{formattedStake} STK</span>}
        />
        <UserStatCard label="Pending Rewards" value={pendingRewards} />
        <UserStatCard label="Unlock Time" value="24 hours" />
      </div>
    </section>
  );
}

export default Dashboard;
