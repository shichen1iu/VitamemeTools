import axios from "axios";
import * as fs from "fs";

export async function getFilterTokens(params: {
  excludeTokens?: string[];
  filters?: any;
  limit?: number;
  offset?: number;
  phrase?: string;
  rankings?: any[];
  statsType?: "FILTERED" | "UNFILTERED";
  tokens?: string[];
}) {
  try {
    // 构建参数字符串，处理 undefined 值
    const excludeTokens = params.excludeTokens
      ? `excludeTokens: ${JSON.stringify(params.excludeTokens)}`
      : "";
    const filters = params.filters
      ? `filters: ${JSON.stringify(params.filters)}`
      : "";
    const limit = params.limit ? `limit: ${params.limit}` : "";
    const offset = params.offset ? `offset: ${params.offset}` : "";
    const phrase = params.phrase
      ? `phrase: ${JSON.stringify(params.phrase)}`
      : "";
    const rankings = params.rankings
      ? `rankings: ${JSON.stringify(params.rankings)}`
      : "";
    const statsType = params.statsType ? `statsType: ${params.statsType}` : "";
    const tokens = params.tokens
      ? `tokens: ${JSON.stringify(params.tokens)}`
      : "";

    const response = await axios.post(
      "https://graph.codex.io/graphql",
      {
        query: `
          query {
            filterTokens(
              ${excludeTokens}
              ${filters}
              ${limit}
              ${offset}
              ${phrase}
              ${rankings}
              ${statsType}
              ${tokens}
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
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "1ea688c9fd149b1cf06a71d1adbc5fc42b50da2c",
        },
      }
    );

    // 将响应数据写入文件
    fs.writeFileSync(
      "6.getFilterTokens.json",
      JSON.stringify(response.data, null, 2)
    );
    console.log("Data has been written to getFilterTokens.json");

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

let BANANAS = "BCorsWYwvNCMspAnRHgPV54XdoAbH5BZ15QL9oL4pump:1399811149";
let SNACK = "JDWYmyVmzU9Mnb8Vgve99xtEdY49JHE6u68e8JhQpump:1399811149";
let tokens = [BANANAS, SNACK];
// 使用示例
getFilterTokens({
  limit: 20,
  statsType: "FILTERED",
  tokens: tokens,
});
