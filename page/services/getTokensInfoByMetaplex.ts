import {
  fetchAllDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, PublicKey } from "@metaplex-foundation/umi";

// 简化的返回接口
interface SimpleTokenInfo {
  publicKey: string;
  uri: string;
}

export async function getTokensInfoByMetaplex(
  tokenAddresses: string[]
): Promise<SimpleTokenInfo[]> {
  const tokenAddressesPubkey: PublicKey[] = tokenAddresses.map((address) =>
    publicKey(address)
  );

  console.log("input data", tokenAddressesPubkey);

  // 先创建一个Map，为所有地址设置默认空值
  const dataMap = new Map(tokenAddressesPubkey.map((pubkey) => [pubkey, ""]));

  const umi = createUmi(
    "https://mainnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
  ).use(mplTokenMetadata());

  //如果有一个mint数据 传入33个mint,只会返回32个mint
  const data = await fetchAllDigitalAsset(umi, tokenAddressesPubkey);

  console.log("result data", data);

  // 更新有返回数据的地址对应的uri
  data.forEach((item) => {
    dataMap.set(item.publicKey, item.metadata.uri);
  });

  console.log("dataMap", dataMap);

  // 返回结果
  return tokenAddressesPubkey.map((pubkey) => ({
    publicKey: pubkey,
    uri: dataMap.get(pubkey) || "",
  }));
}

// 定义 TokenMetadata 接口
interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  showName?: boolean;
  createdOn?: string;
}

export async function fetchIPFSMetadata(uri: string): Promise<TokenMetadata | null> {
  try {
    const response = await fetch(uri, {
      next: {
        revalidate: 3600,
        tags: ["TokenInfo"],
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
}
