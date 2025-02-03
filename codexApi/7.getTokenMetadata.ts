import axios from "axios";
import * as fs from "fs";

export async function getTokenInfo(params: {
  address: string; // Required
  networkId: number; // Required
}) {
  try {
    const response = await axios.post(
      "https://graph.codex.io/graphql",
      {
        query: `
          query {
            getTokenInfo(
              address: "${params.address}"
              networkId: ${params.networkId}
            ) {
              address
              circulatingSupply
              cmcId
              description
              id
              imageBannerUrl
              imageLargeUrl
              imageSmallUrl
              imageThumbUrl
              isScam
              name
              networkId
              symbol
              totalSupply
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

    // Write response data to file
    fs.writeFileSync(
      `7.getTokenInfo.json:${params.address}`,
      JSON.stringify(response.data, null, 2)
    );
    console.log("Data has been written to getTokenInfo.json");

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Usage example
const AI16Z = "7rfHtDbgVhsd71HiAHNyKmannrkcME1hC2L3oZEZpump";
getTokenInfo({
  address: AI16Z,
  networkId: 1399811149, // Solana network ID
});
