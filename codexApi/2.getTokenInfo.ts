import axios from "axios";
import * as fs from "fs";

export async function getTokenInfo(address: string, networkId: number) {
  try {
    const response = await axios.post(
      "https://graph.codex.io/graphql",
      {
        query: `{
          getTokenInfo(address: "${address}", networkId: ${networkId}) {
            symbol
            name
            totalSupply
            circulatingSupply
            description
            isScam
            networkId
            cmcId
            imageLargeUrl
            imageSmallUrl
            imageThumbUrl
            imageBannerUrl
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

    // Write response data to file
    fs.writeFileSync(
      "2.getTokenInfo.json",
      JSON.stringify(response.data, null, 2)
    );
    console.log("Data has been written to 2.getTokenInfo.json");

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Example usage
const tokenAddress = "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"; // WETH contract address
const networkId = 1399811149; // Ethereum mainnet
getTokenInfo(tokenAddress, networkId);
