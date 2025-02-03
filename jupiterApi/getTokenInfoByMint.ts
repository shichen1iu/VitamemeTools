export async function fetchTokenByMint() {
  try {
    const response = await fetch(
      `https://tokens.jup.ag/token/JDWYmyVmzU9Mnb8Vgve99xtEdY49JHE6u68e8JhQpump`
    );
    console.log("nihao");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("获取数据失败", error);
    throw error;
  }
}

fetchTokenByMint()