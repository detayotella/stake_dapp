// hooks/useSubgraph.js
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(import.meta.env.VITE_SUBGRAPH_URL);

export const useSubgraph = () => {
  const getUserStakes = async (userAddress) => {
    const query = gql`
      query GetUserStakes($user: Bytes!) {
        stakeds(where: { user: $user }, orderBy: timestamp, orderDirection: desc) {
          id
          amount
          newTotalStaked
          timestamp
          transactionHash
        }
      }
    `;
    return client.request(query, { user: userAddress.toLowerCase() });
  };

  const getUserRewards = async (userAddress) => {
    const query = gql`
      query GetUserRewards($user: Bytes!) {
        rewardsClaimeds(where: { user: $user }, orderBy: timestamp, orderDirection: desc, first: 1) {
          id
          amount
          newPendingRewards
          timestamp
          transactionHash
        }
      }
    `;
    return client.request(query, { user: userAddress.toLowerCase() });
  };

  // ✅ Add this function
  const getProtocolStats = async () => {
    const query = gql`
      query GetProtocolStats {
        stakeds(first: 1000) {
          amount
        }
        withdrawns(first: 1000) {
          amount
        }
        rewardRateUpdateds(first: 1, orderBy: blockNumber, orderDirection: desc) {
          newRate
        }
      }
    `;

    const data = await client.request(query);

    // Aggregate total staked (sum of staked - withdrawn)
    const totalStaked =
      data.stakeds.reduce((sum, s) => sum + BigInt(s.amount), 0n) -
      data.withdrawns.reduce((sum, w) => sum + BigInt(w.amount), 0n);

    const apr = data.rewardRateUpdateds[0]?.newRate || "0";

    return {
      protocolStats: {
        totalStaked: totalStaked.toString(),
        apr: apr.toString(),
        rewardRate: apr.toString(), // here you can separate if APR vs RewardRate are different
      },
    };
  };

  return { getUserStakes, getUserRewards, getProtocolStats };
};
