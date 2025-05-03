import axios from "axios";
import { getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async socialLogin(provider: string, accessToken: string) {
    try {
      const response = await axios.post(`${API_URL}/users/social-auth`, {
        provider,
        accessToken,
      });

      return response.data;
    } catch (error) {
      console.error("Error during social login:", error);
      throw error;
    }
  },

  async linkSocialAccount(provider: string, accessToken: string) {
    try {
      const token = getCookie("session");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${API_URL}/users/link-social`,
        {
          provider,
          accessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error linking social account:", error);
      throw error;
    }
  },

  async unlinkSocialAccount(provider: string) {
    try {
      const token = getCookie("session");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${API_URL}/users/unlink-social`,
        {
          provider,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error unlinking social account:", error);
      throw error;
    }
  },

  async getSocialAccounts() {
    try {
      const token = getCookie("session");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/users/social-accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error getting social accounts:", error);
      throw error;
    }
  },
};
