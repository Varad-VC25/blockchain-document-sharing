import api from "./api";

const documentService = {
  uploadDocument: async (file, metadata = {}, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    if (metadata.title) formData.append("title", metadata.title);
    if (metadata.description) formData.append("description", metadata.description);
    if (metadata.category) formData.append("category", metadata.category);
    if (metadata.tags) {
      const tagsValue = Array.isArray(metadata.tags) ? metadata.tags.join(",") : metadata.tags;
      formData.append("tags", tagsValue);
    }

    const response = await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
      onUploadProgress,
    });

    return response.data;
  },

  getMyDocuments: async (params = {}) => {
    const response = await api.get("/documents", { params });
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await api.get("/documents/" + id);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete("/documents/" + id);
    return response.data;
  },

  getIpfsStatus: async () => {
    const response = await api.get("/documents/ipfs/status");
    return response.data;
  },

  getCloudStorageAnalytics: async () => {
    const response = await api.get("/documents/cloud/status");
    return response.data;
  },
};

export default documentService;
