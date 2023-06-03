import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../../../utils/Web3Provider';
import './MarketListings.css';
import Loading from '../../Loading/Loading';

// Make sure you have ERC721_ABI available
const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const MarketListings = () => {
  const { web3, marketplaceContract } = useContext(Web3Context);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokensForSale = async () => {
      try {
        if (marketplaceContract) {
          const tokens = await marketplaceContract.methods.getAllTokensForSale().call();

          const tokensData = await Promise.all(
            tokens.map(async (token) => {
              // Create a new contract instance for the ERC721 contract that minted the token
              const tokenContract = new web3.eth.Contract(ERC721_ABI, token.contractAddress);

              // Call the tokenURI function of the ERC721 contract to get the metadata URI
              const tokenUri = await tokenContract.methods.tokenURI(token.tokenId).call();

              // Assume it's an IPFS URI and convert it to a URL
              const metadataUri = tokenUri.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
              const response = await fetch(metadataUri);
              const metadata = await response.json();

              if (!metadata.image) {
                console.error(`Metadata image does not exist for token ID ${token.tokenId}`);
                return null;
              }

              const imageUrl = `https://cloudflare-ipfs.com/ipfs/${metadata.image.replace('ipfs://', '')}`;
              const { contractAddress, tokenId, price, royalty, seller } = token;

              return {
                contractAddress,
                tokenId,
                price,
                royalty,
                seller,
                imageUrl,
                metadata,
              };
            })
          );

          setTokens(tokensData.filter(token => token !== null));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("An error occurred while fetching the tokens for sale:", error);
      }
    };

    fetchTokensForSale();
  }, [marketplaceContract, web3]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="market-listings">
      {tokens.map((token, index) => (
        <div key={index} className="token">
          <p>Contract Address: {token.contractAddress}</p>
          <p>Token ID: {token.tokenId}</p>
          <p>Price: {parseFloat(web3.utils.fromWei(token.price, 'ether')).toFixed(2)} ETH</p>
          <p>Royalty: {token.royalty}%</p>
          <p>Seller: {token.seller}</p>
          <img src={token.imageUrl} alt={`Token ${token.tokenId}`} />
        </div>
      ))}
    </div>
  );
};

export default MarketListings;
