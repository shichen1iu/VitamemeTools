import mockVitamemeData from "./mockVitamemData.json";

export interface topPoolParams {
  token: string;
  rewardPoolLiquidity: number;
  rewardPoolChange1: number;
  rewardPoolChange4: number;
  rewardPoolChange12: number;
  rewardPoolChange24: number;
  donors1: number;
  donors4: number;
  donors12: number;
  donors24: number;
  userClaimed: number;
  Engagement1: number;
  Engagement4: number;
  Engagement12: number;
  Engagement24: number;
  rewardIndex: number;
}

export async function getTopPool(): Promise<topPoolParams[]> {
  return mockVitamemeData;
}
