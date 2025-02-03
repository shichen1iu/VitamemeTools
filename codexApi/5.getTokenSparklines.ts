import axios from "axios";
import * as fs from "fs";

export async function getTokenSparklines(
  tokens: Array<{ address: string; networkId: number }>
) {
  try {
    // 将代币信息格式化为 "address:networkId" 格式的数组
    const tokenIds = tokens.map(
      (token) => `${token.address}:${token.networkId}`
    );

    const response = await axios.post(
      "https://graph.codex.io/graphql",
      {
        query: `{
          tokenSparklines(
            input: {
              ids: ${JSON.stringify(tokenIds)}
            }
          ) {
            id
            attribute
            sparkline {
              timestamp
              value
            }
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

    // 将响应数据写入文件
    fs.writeFileSync(
      "5.getTokenSparklines.json",
      JSON.stringify(response.data, null, 2)
    );
    console.log("数据已写入 getTokenSparklines.json");

    return response.data;
  } catch (error) {
    console.error("错误:", error);
    throw error;
  }
}

// 使用示例
const tokens = [
  {
    address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    networkId: 1399811149,
  },
  // 可以根据需要添加更多代币
];
getTokenSparklines(tokens);
