import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TokenCard from '../Wallet/TokenCard.js';
import './NFTCard.css';
import Loading from '../Loading/Loading';

function NFTList() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let accounts;
        try {
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          if (error.code === 4001) {
            setError('User rejected account access');
            setLoading(false);
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        const address = accounts[0];
        setUserAddress(address);

        let apiUrl;
const chainId = Number.parseInt(window.ethereum.chainId, 16);  // Convert to Number
if (chainId === 14) {
  // Flare Chain
  apiUrl = 'https://flare-explorer.flare.network/api';
} else if (chainId === 19) {
  // Songbird
  apiUrl = 'https://songbird-explorer.flare.network/api';
} else if (chainId === 31337) {  // Compare with 31337 directly
  // Hardhat
  apiUrl = 'http://localhost:8545'; 
} else {
  setError('Unsupported network');
  setLoading(false);
  return;
}

        

        const result = await axios.get(`${apiUrl}?module=account&action=tokenlist&address=${address}`);
        console.log('API Response:', result.data);

        if (result.data.result && Array.isArray(result.data.result)) {
          const nftsWithTxHistory = await Promise.all(result.data.result.map(async (nft) => {
            const txHistory = await fetchTokenTransactionHistory(nft.contractAddress, address, apiUrl);
            return { ...nft, txHistory };
          }));

          setNfts(nftsWithTxHistory);
        } else {
          setError("API didn't return a valid array.");
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTokenTransactionHistory = async (contractAddress, address, apiUrl) => {
    const result = await axios.get(`${apiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}`);
    console.log('Token Transaction History:', result.data);

    return result.data.result || [];
  };

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmountToSend(event.target.value);
  };

  const handleSend = async () => {
    try {
      const selectedNFT = nfts.find((nft) => nft.name === selectedToken);
  
      if (!selectedNFT) {
        setError('Selected token not found.');
        return;
      }
  
      const tokenContractAddress = selectedNFT.contractAddress;
      const recipient = recipientAddress.toLowerCase();
      const web3 = window.ethereum;
      const accounts = await web3.request({ method: 'eth_requestAccounts' });
      const senderAddress = accounts[0];
  
      // Handle sending ERC20 tokens
      if (!recipientAddress || !amountToSend) {
        setError('Please provide recipient address and amount');
        return;
      }

      const txData = {
        to: tokenContractAddress,
        from: senderAddress,
        value: '0x0',
        data: `0xa9059cbb000000000000000000000000${recipient.replace('0x', '').toLowerCase()}${parseInt(amountToSend).toString(16).padStart(64, '0')}`,
      };

      const result = await web3.request({ method: 'eth_sendTransaction', params: [txData] });
      console.log('Transaction Result:', result);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (nfts.length === 0) {
    return <div className="no-results">No NFTs found for address: {userAddress}</div>;
  }

  const selectedNFT = nfts.find((nft) => nft.name === selectedToken);

  return (
    <div className="nft-list">
      <select className="token-select" value={selectedToken} onChange={handleTokenChange}>
        <option value="">--Select a token--</option>
        {nfts.map((nft, index) => (
          <option key={index} value={nft.name}>
            {nft.name}
          </option>
        ))}
      </select>
      {selectedToken && selectedNFT.type === 'ERC-20' && (
        <div className="input-group">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={handleRecipientAddressChange}
          />
          
          <input
          className='amount-input'
            type="number"
            placeholder="Amount to Send"
            value={amountToSend}
            onChange={handleAmountChange}
          />
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      )}
      {selectedNFT && <TokenCard nft={selectedNFT} />}

     
    </div>
  );
}



export default NFTList;