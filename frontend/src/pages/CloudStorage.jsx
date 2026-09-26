import { useEffect, useState } from "react";
import {
  FiCloud, FiShield, FiCheckCircle, FiRefreshCw, FiFileText,
  FiHardDrive, FiLock, FiAlertCircle
} from "react-icons/fi";
import { toast } from "react-toastify";
import documentService from "@services/documentService";
import { formatFileSize, formatDate } from "@utils/formatters";
import Loader from "@components/common/Loader";

const CloudStorage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchCloudData = async () => {
    setLoading(true);
    try {
      const response = await documentService.getCloudStorageAnalytics();
      setData(response?.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load cloud storage status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  const stats = data?.stats || {
    totalDocuments: 0,
    backedUpDocuments: 0,
    backupPercentage: 100,
    totalStorageBytes: 0,
  };
  const service = data?.service || { configured: false, status: "checking", message: "" };
  const docs = data?.documents || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Cloud Storage Backup</h1>
          <p className="text-dark-500 mt-1">Cloudinary encrypted backup and redundancy status</p>
        </div>
        <button onClick={fetchCloudData} className="btn-secondary flex items-center gap-2">
          <FiRefreshCw />
          Refresh Status
        </button>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <FiCloud className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Hybrid Storage Redundancy</h2>
              <p className="text-white/90 text-sm mt-1">
                IPFS Primary + Cloudinary Encrypted Backup
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-center">
            <p className="text-xs text-white/80">Backup Coverage</p>
            <p className="text-lg font-bold text-green-300">{stats.backupPercentage}%</p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Checking cloud backup status..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiCloud className="text-2xl text-primary-600" />
                <span className={"px-2.5 py-0.5 rounded-full text-xs font-semibold " + (service.configured ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400")}>
                  {service.configured ? "ACTIVE" : "NOT CONFIGURED"}
                </span>
              </div>
              <p className="text-xs text-dark-500 mb-1">Cloud Provider</p>
              <p className="text-xl font-bold text-dark-900 dark:text-white">Cloudinary</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiShield className="text-2xl text-purple-600" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  AES-256
                </span>
              </div>
              <p className="text-xs text-dark-500 mb-1">Backup Protection</p>
              <p className="text-xl font-bold text-dark-900 dark:text-white">Encrypted</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiCheckCircle className="text-2xl text-green-600" />
                <span className="text-xs font-bold text-green-600">{stats.backupPercentage}%</span>
              </div>
              <p className="text-xs text-dark-500 mb-1">Backed Up Files</p>
              <p className="text-xl font-bold text-dark-900 dark:text-white">
                {stats.backedUpDocuments} / {stats.totalDocuments}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiHardDrive className="text-2xl text-orange-600" />
                <span className="text-xs font-semibold text-dark-400">Total Size</span>
              </div>
              <p className="text-xs text-dark-500 mb-1">Protected Storage</p>
              <p className="text-xl font-bold text-dark-900 dark:text-white">
                {formatFileSize(stats.totalStorageBytes)}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
              <FiLock className="text-primary-600" />
              Encrypted Backup Records
            </h3>

            {docs.length === 0 ? (
              <div className="text-center py-12 text-dark-500">
                <FiFileText className="text-4xl mx-auto mb-2 text-dark-400" />
                <p>No documents yet. Upload a file to see cloud backup status.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-dark-200 dark:border-dark-800 text-dark-500">
                      <th className="py-3 px-4">Document</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">IPFS CID</th>
                      <th className="py-3 px-4">Cloud Backup</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                    {docs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-dark-900 dark:text-white">{doc.title}</td>
                        <td className="py-3 px-4 text-dark-500">{formatFileSize(doc.fileSize)}</td>
                        <td className="py-3 px-4 font-mono text-xs text-primary-600 dark:text-primary-400">
                          {doc.ipfsCid ? doc.ipfsCid.substring(0, 16) + "..." : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {doc.hasCloudBackup ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              <FiCheckCircle /> Backed Up
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                              <FiAlertCircle /> IPFS Only
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-dark-500">{formatDate(doc.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {!service.configured && (
            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-300">
              Cloudinary is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env, then restart backend.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CloudStorage;
