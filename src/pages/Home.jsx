import Dashboard from "../components/Dashboard/Dashboard";
import Header from "../components/Layout/Header";
import ClaimCard from "../components/Staking/ClaimCard";
import EmergencyCard from "../components/Staking/EmergencyCard";
import StakeForm from "../components/Staking/StakingForm";
import WithdrawCard from "../components/Staking/WithdrawCard";
import Summary from "../components/Summary/Summary";


 function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--background-color)]">
      <Header />
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-4xl flex-col gap-8">
          <StakeForm />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WithdrawCard />
            <ClaimCard />
            <EmergencyCard />
          </div>
          <Dashboard />
          <Summary />
        </div>
      </main>
    </div>
  );
}

export default Home; 
