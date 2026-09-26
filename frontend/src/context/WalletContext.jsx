import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";
import { toast } from "react-toastify";
import userService from "@services/userService";
import { useAuth } from "@context/AuthContext";
const WalletContext = createContext(null);

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

export const WalletProvider = ({ children }) => {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const shortAddress = useMemo(() => {
    if (!account) return "";
    return account.slice(0, 6) + "..." + account.slice(-4);
  }, [account]);

  const isOnSepolia = Number(chainId) === SEPOLIA_CHAIN_ID;

  const getProvider = () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    return new BrowserProvider(window.ethereum);
  };

  const refreshWalletState = async () => {
    if (!window.ethereum) {
      setIsMetaMaskInstalled(false);
      setAccount(null);
      setChainId(null);
      return;
    }

    setIsMetaMaskInstalled(true);
    const provider = getProvider();
    const accounts = await provider.send("eth_accounts", []);
    const network = await provider.getNetwork();

    setAccount(accounts?.[0] ? String(accounts[0]).toLowerCase() : null);
    setChainId(Number(network.chainId));
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (error) {
      // If Sepolia not added, add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: "Sepolia Test Network",
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed");
        window.open("https://metamask.io/download/", "_blank");
        return null;
      }

      setIsConnecting(true);
      const provider = getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      let selected = accounts?.[0] ? String(accounts[0]).toLowerCase() : null;
      let currentChainId = Number(network.chainId);

      setAccount(selected);
      setChainId(currentChainId);

      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        toast.info("Switching to Sepolia network...");
        await switchToSepolia();
        const updated = await provider.getNetwork();
        currentChainId = Number(updated.chainId);
        setChainId(currentChainId);
      }

      // Link wallet to logged-in user account
      if (isAuthenticated && selected) {
        try {
          const res = await userService.linkWallet(selected);
          if (res?.data?.user && updateUser) {
            updateUser(res.data.user);
          }
          toast.success("Wallet connected & linked to your account");
        } catch (err) {
          const msg = err.response?.data?.message || "Wallet connected, but failed to link account";
          toast.warning(msg);
        }
      } else {
        toast.success("Wallet connected");
      }

      return selected;
    } catch (error) {
      const msg = error?.message || "Failed to connect wallet";
      if (String(msg).toLowerCase().includes("user rejected")) {
        toast.error("Connection request rejected in MetaMask");
      } else {
        toast.error(msg);
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setAccount(null);
    // Unlink from backend if logged in
    if (isAuthenticated) {
      try {
        const res = await userService.unlinkWallet();
        if (res?.data?.user && updateUser) updateUser(res.data.user);
      } catch (e) {}
    }
    toast.info("Wallet disconnected");
  };

  useEffect(() => {
    refreshWalletState().catch(() => {});

    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      const next = accounts?.[0] ? String(accounts[0]).toLowerCase() : null;
      setAccount(next);
      if (!next) {
        toast.info("Wallet disconnected in MetaMask");
      } else if (isAuthenticated) {
        try {
          const res = await userService.linkWallet(next);
          if (res?.data?.user && updateUser) updateUser(res.data.user);
          toast.success("Wallet account switched and linked");
        } catch (e) {
          toast.warning("Wallet switched, but account link failed");
        }
      }
    };

    const handleChainChanged = (chainIdHex) => {
      const id = parseInt(chainIdHex, 16);
      setChainId(id);
      if (id !== SEPOLIA_CHAIN_ID) {
        toast.warning("Please switch to Sepolia test network");
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (!window.ethereum?.removeListener) return;
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [isAuthenticated]);

  // If user profile already has wallet, show it as preferred linked wallet
  useEffect(() => {
    if (!account && user?.walletAddress) {
      // Don't force set account without provider permission; only for display fallback
    }
  }, [user, account]);

  const value = {
    account,
    shortAddress,
    chainId,
    isOnSepolia,
    isConnecting,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    refreshWalletState,
    linkedWallet: user?.walletAddress || null,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export default WalletContext;
