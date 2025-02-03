export interface FilterTokensParams {
  limit?: number;
  offset?: number;
  phrase?: string;
  rankings?: string[];
  statsType?: "FILTERED" | "UNFILTERED";
  tokens?: string[];
}

interface TokenResult {
  buyCount1: number;
  buyCount4: number;
  buyCount12: number;
  buyCount24: number;
  change1: number;
  change4: number;
  change12: number;
  change24: number;
  createdAt: string;
  exchanges: {
    id: string;
    name: string;
  }[];
  high1: number;
  high4: number;
  high12: number;
  high24: number;
  holders: number;
  isScam: boolean;
  lastTransaction: string;
  liquidity: number;
  marketCap: number;
  priceUSD: number;
  token: {
    address: string;
    name: string;
    symbol: string;
  };
  volume1: number;
  volume4: number;
  volume12: number;
  volume24: number;
}

interface FilterTokensResponse {
  count: number;
  page: number;
  results: TokenResult[];
}

export async function fetchFilterTokens(
  params: FilterTokensParams
): Promise<FilterTokensResponse> {
  // 构建参数字符串，处理 undefined 值
  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      // 对于 statsType，不需要 JSON.stringify
      if (key === "statsType") {
        return `${key}: ${value}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
      .join("\n");
    
  const res = await fetch("https://graph.codex.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "1ea688c9fd149b1cf06a71d1adbc5fc42b50da2c",
      // "Cache-Control": "no-cache",
      // Pragma: "no-cache",
    },
    body: JSON.stringify({
      query: `
        query {
          filterTokens(
            ${queryParams}
          ) {
            count
            page
            results {
              buyCount1
              buyCount4
              buyCount12
              buyCount24
              change1
              change4
              change12
              change24
              createdAt
              exchanges {
                id
                name
              }
              high1
              high4
              high12
              high24
              holders
              isScam
              lastTransaction
              liquidity
              marketCap
              priceUSD
              token {
                address
                name
                symbol
              }
              volume1
              volume4
              volume12
              volume24
            }
          }
        }
      `,
      timestamp: new Date().getTime(),
    }),
    next: {
      revalidate: 3600, // 1小时重新验证一次
      tags: ["TokenInfo"],
    },
  });

  if (!res.ok) {
    console.log('filterToken 获取数据失败');
    const errorData = await res.json().catch(() => null);
    throw new Error(
      `Failed to fetch filter tokens: ${res.status} ${res.statusText}${
        errorData ? ` - ${JSON.stringify(errorData)}` : ""
      }`
    );
  }
  const data = await res.json();
  console.log('filterToken 获取数据成功',data);
  return data.data.filterTokens;
}
