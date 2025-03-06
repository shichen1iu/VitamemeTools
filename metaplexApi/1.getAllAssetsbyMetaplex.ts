import {
  fetchAllDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";
import * as fs from "fs";

const mockData = JSON.parse(fs.readFileSync("./mockdata.json", "utf-8"));
const tokenAddresses: PublicKey[] = mockData.map((item: { token: string }) =>
  publicKey(item.token)
);

//Fetch mint metadata using metaplex sdk
const umi = createUmi(
  "https://mainnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
).use(mplTokenMetadata());
const data = await fetchAllDigitalAsset(umi, tokenAddresses);

console.log(data);
fs.writeFileSync(
  `1.getTokenMetadataByMetaplex.json`,
  JSON.stringify(
    data,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  )
);

// //Download metadata from metadata uri, mostly ipfs
// const ipfsMetadata = await axios.get(data.metadata.uri, {
//   headers: {
//     "User-Agent": { USER_AGENT }, //Without user agent you may get forbidden error
//   },
// });

// //Image uri
// const imageUri = ipfsMetadata.data.image;
