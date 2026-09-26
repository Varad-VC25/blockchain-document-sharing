import { FiLink, FiX, FiAlertTriangle } from "react-icons/fi";
import { useWallet } from "@context/WalletContext";

const WalletConnect = ({ compact = false }) => {
  const {
    account,
    shortAddress,
    isConnecting,
    isMetaMaskInstalled,
    isOnSepolia,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  } = useWallet();

  if (!isMetaMaskInstalled) {
    return (
      <button
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        className="btn-secondary text-sm flex items-center gap-2"
      >
        <FiAlertTriangle />
        {compact ? "Install" : "Install MetaMask"}
      </button>
    );
  }

  if (!account) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-primary text-sm flex items-center gap-2"
      >
        <FiLink />
        {isConnecting ? "Connecting..." : compact ? "Connect" : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isOnSepolia && (
        <button onClick={switchToSepolia} className="btn-secondary text-xs">
          Switch to Sepolia
        </button>
      )}
      <div className="px-3 py-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-xs font-mono text-dark-700 dark:text-dark-300">
        {shortAddress}
      </div>
      <button onClick={disconnectWallet} className="btn-secondary text-sm flex items-center gap-2">
        <FiX />
        {compact ? "" : "Disconnect"}
      </button>
    </div>
  );
};

export default WalletConnect;
