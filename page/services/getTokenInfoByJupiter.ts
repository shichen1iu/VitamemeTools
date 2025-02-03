// ... existing code ...

export interface JupiterTokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  daily_volume: number;
  created_at: string;
  freeze_authority: string | null;
  mint_authority: string | null;
  permanent_delegate: string | null;
  minted_at: string | null;
  extensions: {
    coingeckoId: string;
  };
}

export interface SimpleTokenInfo {
  publicKey: string;
  uri: string;
}

// import axios from "axios";

// export async function fetchTokenByMint(mint: string) {
//   try {
//     const response = await axios.get(`https://tokens.jup.ag/token/${mint}`);

//     console.log(
//       "https://tokens.jup.ag/token/${mint}",
//       `https://tokens.jup.ag/token/${mint}`
//     );
//     console.log("写入成功");
//     return response.data;
//   } catch (error) {
//     console.error("获取数据失败", error);
//   }
// }

export async function fetchTokenByMint(
  mint: string
): Promise<SimpleTokenInfo | null> {
  try {
    const res = await fetch(`https://tokens.jup.ag/token/${mint}`, {
      next: {
        revalidate: 3600,
        tags: ["TokenInfo"],
      },
      headers: {
        Accept: "application/json",
        "User-Agent": `Vitameme-${Math.random().toString(36).slice(2, 8)}`,
      },
    });

    if (!res.ok) {
      console.error(`Token ${mint} 请求失败, 状态码: ${res.status}`);
      const errorText = await res.text();
      console.error(`错误详情:`, errorText);
      return null;
    }

    const data: JupiterTokenInfo = await res.json();

    // 只返回需要的数据
    return {
      publicKey: data.address,
      uri: data.logoURI,
    };
  } catch (error) {
    console.error(`获取 token ${mint} 数据失败:`, error);
    return null;
  }
}
