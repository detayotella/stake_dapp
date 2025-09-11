import formatToken from "../../utils/format";
import useClaim from "../../hooks/useClaim";
import ProtocolStatCard from "./ProtocolStatCard";
import useStake from "../../hooks/useStake";

function Summary() {
  const { latestClaimed,  } = useClaim();
  const { totalStaked } = useStake();

  const formattedClaimed = formatToken(latestClaimed);
  const formattedTotalStaked = formatToken(totalStaked?.toString() || "0");

  return (
    <section>
      <h2 className="text-[var(--text-color)] text-2xl font-bold mb-4 px-2">
        Platform Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProtocolStatCard label="Total Staked" value={formattedTotalStaked}/>
        <ProtocolStatCard label="Current APR" value="5%" />
        <ProtocolStatCard
          label="Reward Rate"
          value={latestClaimed ? `${formattedClaimed} STK/day` : "0 STK/day"}
        />
      </div>
    </section>
  );
}

export default Summary;
