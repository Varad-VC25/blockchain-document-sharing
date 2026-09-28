import api from "./api";

const shareService = {
  resolveRecipient: async (recipient) => {
    const response = await api.post("/share/resolve", { recipient });
    return response.data;
  },

  grantShareAccess: async (data) => {
    const response = await api.post("/share/grant", data);
    return response.data;
  },

  getSharedWithMe: async () => {
    const response = await api.get("/share/shared-with-me");
    return response.data;
  },

  revokeShareAccess: async (data) => {
    const response = await api.post("/share/revoke", data);
    return response.data;
  },
};

export default shareService;
