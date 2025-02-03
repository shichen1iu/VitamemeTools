import * as fs from "fs";

const url =
  "https://api.helius.xyz/v0/token-metadata?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a";

// 读取 mockdata.json 文件并解析
const mockData = JSON.parse(fs.readFileSync("./mockdata.json", "utf-8"));
// const tokenAddresses: string[] = mockData.map(
//   (item: { token: string }) => item.token
// );

const tokenAddresses = ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"];

const getMetadata = async () => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mintAccounts: tokenAddresses,
      includeOffChain: true,
      disableCache: false,
    }),
  });

  const data = await response.json();
  fs.writeFileSync(`1.getTokenMetadataOfUSDC.json`, JSON.stringify(data, null, 2));
};

getMetadata();
