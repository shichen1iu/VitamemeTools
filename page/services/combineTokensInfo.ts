import { fetchFilterTokens, FilterTokensParams } from "./filterTokensByCodex";
import { getTopPool } from "./getTopPool";
import {
  getTokensInfoByMetaplex,
  fetchIPFSMetadata,
} from "./getTokensInfoByMetaplex";
import { fetchTokenByMint } from "./getTokenInfoByJupiter";

export interface CombineTokenParams {
  change1: number;
  change4: number;
  change12: number;
  change24: number;
  volume1: number;
  volume4: number;
  volume12: number;
  volume24: number;
  priceUSD: number;
  marketCap: number;
  token: {
    address: string;
    name: string;
    symbol: string;
  };
  logoURI: string;
  rewardPoolLiquidity: number;
  rewardPoolChange1: number;
  rewardPoolChange4: number;
  rewardPoolChange12: number;
  rewardPoolChange24: number;
  donors1: number;
  donors4: number;
  donors12: number;
  donors24: number;
  userClaimed: number;
  Engagement1: number;
  Engagement4: number;
  Engagement12: number;
  Engagement24: number;
  rewardIndex: number;
}

export async function combineTokenInfo(): Promise<CombineTokenParams[]> {
  const params: FilterTokensParams = {
    limit: 200,
    offset: 0,
    phrase: "",
    rankings: [],
    statsType: "FILTERED",
    tokens: [],
  };

  // 首先获取 top pools 数据
  const topPools = await getTopPool();
  console.log("Top Pools count:", topPools.length);
  console.log("topPoolsdata", topPools);

  // 使用 top pools 中的 token 地址
  params.tokens = topPools.map((pool) => pool.token);

  if (!params.tokens || params.tokens.length === 0) {
    return [];
  }

  const [filterResults, metaplexResults] = await Promise.all([
    fetchFilterTokens(params),
    getTokensInfoByMetaplex(params.tokens),
  ]);

  console.log("Filter Results count:", filterResults.results.length);
  console.log("Metaplex Results count:", metaplexResults.length);

  // 创建 Map 存储 metaplex 和 topPool 数据
  const metaplexInfoMap = new Map(
    metaplexResults.map((info) => [info.publicKey, info])
  );
  const topPoolMap = new Map(topPools.map((pool) => [pool.token, pool]));

  return await Promise.all(
    filterResults.results.map(async (tokenResult) => {
      const metaplexInfo = metaplexInfoMap.get(tokenResult.token.address);
      const poolInfo = topPoolMap.get(tokenResult.token.address);
      console.log("metaplexInfo", metaplexInfo);

      // 获取 metadata 先用metaplex 获取，如果获取不到，则用jupiter 获取
      let logoURI = "";
      if (metaplexInfo?.uri) {
        const metadata = await fetchIPFSMetadata(metaplexInfo.uri);
        logoURI = metadata?.image || "";
      } else {
        const jupiterToken = await fetchTokenByMint(tokenResult.token.address);
        logoURI = jupiterToken?.uri || "";
      }

      return {
        change1: tokenResult.change1,
        change4: tokenResult.change4,
        change12: tokenResult.change12,
        change24: tokenResult.change24,
        volume1: tokenResult.volume1,
        volume4: tokenResult.volume4,
        volume12: tokenResult.volume12,
        volume24: tokenResult.volume24,
        priceUSD: tokenResult.priceUSD,
        marketCap: tokenResult.marketCap,
        token: {
          address: tokenResult.token.address,
          name: tokenResult.token.name,
          symbol: tokenResult.token.symbol,
        },
        logoURI,
        rewardPoolLiquidity: poolInfo?.rewardPoolLiquidity || 0,
        rewardPoolChange1: poolInfo?.rewardPoolChange1 || 0,
        rewardPoolChange4: poolInfo?.rewardPoolChange4 || 0,
        rewardPoolChange12: poolInfo?.rewardPoolChange12 || 0,
        rewardPoolChange24: poolInfo?.rewardPoolChange24 || 0,
        donors1: poolInfo?.donors1 || 0,
        donors4: poolInfo?.donors4 || 0,
        donors12: poolInfo?.donors12 || 0,
        donors24: poolInfo?.donors24 || 0,
        userClaimed: poolInfo?.userClaimed || 0,
        Engagement1: poolInfo?.Engagement1 || 0,
        Engagement4: poolInfo?.Engagement4 || 0,
        Engagement12: poolInfo?.Engagement12 || 0,
        Engagement24: poolInfo?.Engagement24 || 0,
        rewardIndex: poolInfo?.rewardIndex || 0,
      };
    })
  );
}
