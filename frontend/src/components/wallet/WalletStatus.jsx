import { FiCheckCircle, FiXCircle, FiLink } from "react-icons/fi";
import { useWallet } from "@context/WalletContext";

const WalletStatus = () => {
  const { account, shortAddress, isOnSepolia, linkedWallet, isMetaMaskInstalled } = useWallet();

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 space-y-4">
      <h3 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
        <FiLink className="text-primary-600" />
        Wallet Status
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-dark-500">MetaMask</span>
          <span className={"font-semibold " + (isMetaMaskInstalled ? "text-green-600" : "text-red-600")}> 
            {isMetaMaskInstalled ? "Installed" : "Not Installed"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-dark-500">Connected Account</span>
          <span className="font-mono text-dark-900 dark:text-white">{account ? shortAddress : "Not connected"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-dark-500">Network</span>
          <span className={"inline-flex items-center gap-1 font-semibold " + (isOnSepolia ? "text-green-600" : "text-yellow-600")}> 
            {isOnSepolia ? <FiCheckCircle /> : <FiXCircle />}
            {isOnSepolia ? "Sepolia" : "Wrong Network"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-dark-500">Linked to Account</span>
          <span className="font-mono text-dark-900 dark:text-white">
            {linkedWallet ? linkedWallet.slice(0, 6) + "..." + linkedWallet.slice(-4) : "Not linked"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
