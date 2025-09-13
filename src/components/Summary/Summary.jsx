import { useSubgraph } from "../../hooks/useSubgraph";
import { useEffect, useState } from "react";
import ProtocolStatCard from "./ProtocolStatCard";
import formatToken from "../../utils/format";

function Summary() {
  const { getProtocolStats } = useSubgraph();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getProtocolStats();
        setStats(data.protocolStats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    fetchStats();
  }, []);

  const formattedStaked = stats ? formatToken(stats.totalStaked) : "0";
  const apr = stats ? `${stats.apr}%` : "0%";
  const rewardRate = stats ? `${formatToken(stats.rewardRate)} STK/day` : "0 STK/day";

  return (
    <section>
      <h2 className="text-[var(--text-color)] text-2xl font-bold mb-4 px-2">
        Platform Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProtocolStatCard label="Total Staked" value={<span>{formattedStaked} STK</span>} />
        <ProtocolStatCard label="Current APR" value={apr} />
        <ProtocolStatCard label="Reward Rate" value={rewardRate} />
      </div>
    </section>
  );
}

export default Summary; 
