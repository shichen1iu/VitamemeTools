import axios from "axios";
import * as fs from "fs";

export async function getBoostedToken() {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/token-boosts/latest/v1`
    );
    fs.writeFileSync(`1.BoostedToken.json`, JSON.stringify(response.data, null, 2));
    console.log("写入成功");
    console.log(`共有${response.data.length}条数据`);
    return response.data;
  } catch (error) {
    console.error("获取数据失败", error);
  }
}

// getTokensbyTag("verified");
// getTokensbyTag("community");
// getTokensbyTag("lst");
// getTokensbyTag("birdeye-trending");
getBoostedToken();
