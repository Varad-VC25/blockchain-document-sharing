import api from "./api";

const userService = {
  getProfile: async () => {
    const res = await api.get("/user/profile");
    return res.data;
  },
  linkWallet: async (walletAddress) => {
    const res = await api.patch("/user/wallet", { walletAddress });
    return res.data;
  },
  unlinkWallet: async () => {
    const res = await api.delete("/user/wallet");
    return res.data;
  },
};

export default userService;
