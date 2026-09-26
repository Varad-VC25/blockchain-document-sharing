import { FiUser, FiShield } from "react-icons/fi";
import { useAuth } from "@context/AuthContext";
import WalletConnect from "@components/wallet/WalletConnect";
import WalletStatus from "@components/wallet/WalletStatus";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Profile Settings</h1>
        <p className="text-dark-500 mt-1">Manage your account and wallet connection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <FiUser className="text-xl text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Account Information</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-3 border-b border-dark-100 dark:border-dark-800">
              <span className="text-dark-500">Full Name</span>
              <span className="font-semibold text-dark-900 dark:text-white">{user?.fullName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-dark-100 dark:border-dark-800">
              <span className="text-dark-500">Email</span>
              <span className="font-semibold text-dark-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-dark-100 dark:border-dark-800">
              <span className="text-dark-500">Role</span>
              <span className="badge badge-info uppercase">{user?.role}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-dark-500">Linked Wallet</span>
              <span className="font-mono text-dark-900 dark:text-white">
                {user?.walletAddress
                  ? user.walletAddress.slice(0, 8) + "..." + user.walletAddress.slice(-6)
                  : "Not linked"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <WalletStatus />

          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiShield className="text-xl text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white">Wallet Actions</h3>
            </div>
            <p className="text-sm text-dark-500 mb-4">
              Connect MetaMask to enable blockchain features in upcoming modules.
            </p>
            <WalletConnect />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
