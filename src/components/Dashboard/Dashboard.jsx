import formatToken from "../../utils/format";
import useStake from "../../hooks/useStake";
import useWithdraw from "../../hooks/useWithdraw";
import UserStatCard from "./useStatCard";
import useClaim from "../../hooks/useClaim";

function Dashboard() {
  const { totalStaked, loading } = useStake(); 
  const { events } = useWithdraw();
  const { pendingRewards }= useClaim();

  const latestStake =
    events.length > 0
      ? events[events.length - 1].newTotalStaked?.toString() || "0"
      : totalStaked;

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
