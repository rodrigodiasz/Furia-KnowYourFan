import { api } from "./api";

export interface PointsData {
  points: number;
  pointsHistory: {
    id: string;
    points: number;
    action: string;
    createdAt: string;
  }[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
}

export const getPoints = async (): Promise<PointsData> => {
  const response = await api.get("/points/me");
  return response.data;
};

export const redeemPoints = async (
  rewardId: string,
  points: number
): Promise<void> => {
  const response = await api.post("/points/redeem", { rewardId, points });
  return response.data;
};
