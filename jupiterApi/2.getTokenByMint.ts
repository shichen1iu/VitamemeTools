import axios from "axios";
import * as fs from "fs";

export async function getTokenByMint(mint: string) {
  try {
    const response = await axios.get(
      `https://tokens.jup.ag/token/${mint}`
    );
    fs.writeFileSync(`Token:${mint}.json`, JSON.stringify(response.data, null, 2));
    console.log("写入成功");
    return response.data;
  } catch (error) {
    console.error("获取数据失败", error);
  }
}

// getTokensbyTag("verified");
// getTokensbyTag("community");
// getTokensbyTag("lst");
// getTokensbyTag("birdeye-trending");
getTokenByMint("HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC");
