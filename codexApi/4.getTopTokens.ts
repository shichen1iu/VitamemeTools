import axios from "axios";
import * as fs from "fs";
export async function getTopTokens({
  limit = 10,
  networkFilter = [],
  resolution = "1D",
}: {
  limit?: number;
  networkFilter?: number[];
  resolution?: string;
} = {}) {
  try {
    const response = await axios.post(
      "https://graph.codex.io/graphql",
      {
        query: `{
          listTopTokens(
            limit: ${limit}
            networkFilter: ${JSON.stringify(networkFilter)}
            resolution: "${resolution}"
          ) {
            address
            networkId
            name
            symbol
            price
            priceChange
            volume
            liquidity
            marketCap
            txnCount24
            uniqueBuys24
            uniqueSells24
            imageLargeUrl
            isScam
            createdAt
            lastTransaction
          }
        }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "1ea688c9fd149b1cf06a71d1adbc5fc42b50da2c",
        },
      }
    );

    // 添加调试日志
    // console.log("API Response:", response.data);

    // 写入文件
    fs.writeFileSync(
      "4.getTopTokens.json",
      JSON.stringify(response.data, null, 2)
    );
    console.log("Data has been written to 4.getTopTokens.json");

    return response.data;
  } catch (error) {
    // 增强错误日志
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data);
      console.error("API Error Status:", error.response?.status);
    }
    console.error("Error details:", error);
    throw error;
  }
}

// 立即执行函数来测试
(async () => {
  try {
    const result = await getTopTokens({
      limit: 50,
      networkFilter: [1399811149],
      resolution: "60",
    });
    // console.log("Function result:", result);
  } catch (error) {
    console.error("Test execution error:", error);
  }
})();