import axios from "axios";
import * as fs from "fs";

export async function getNetworkID() {
  try {
    const response = await axios.post(
      "https://graph.codex.io/graphql",
      {
        query: `{
                        getNetworks {
                            name
                            id
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
    fs.writeFileSync("1.get NetworkID.json", JSON.stringify(response.data, null, 2));
    console.log("Data has been written to 1.getNetworkID.json");

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

getNetworkID();
