import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiPlusCircle, FiFolder } from 'react-icons/fi';
import { Web3Context } from '../../utils/Web3Provider.js';
import songbirdLogo from '../../assets/songbird-logo.png';
import flareLogo from '../../assets/flarelogo.png';
import { FaWallet } from 'react-icons/fa';

const StyledNav = styled.nav`
  background-color: #252525;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .app-name {
    font-weight: 600;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;

  li {
    margin-right: 15px;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    display: flex;
    align-items: center;

    .nav-icon {
      margin-right: 5px;
      color: #ffffff;
    }

    &:hover {
      color: #ffcc00;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 10px;

    li {
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
`;

const NetworkSelect = styled.select`
  color: #ffffff;
  background-color: #252525;
  border: none;
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333333;
  }

  &:focus {
    background-color: #444444;
  }
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 5px;
  vertical-align: middle;
`;

const NavBar = () => {
  const { web3 } = useContext(Web3Context);
  const [currentNetworkId, setCurrentNetworkId] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [account, setAccount] = useState('');

  const handleNetworkChange = async (e) => {
    const networkId = parseInt(e.target.value, 10);
    if (web3 && web3.currentProvider.isMetaMask) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${networkId.toString(16)}` }],
        });
        if (networkId === 19) {
          setSelectedNetwork(songbirdLogo);
        } else if (networkId === 14) {
          setSelectedNetwork(flareLogo);
        } else if (networkId === 31337) {
          setSelectedNetwork(null); 
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const getCurrentNetworkId = async () => {
      if (web3 && web3.currentProvider.isMetaMask) {
        try {
          const networkId = await web3.eth.net.getId();
          setCurrentNetworkId(networkId.toString());
          if (networkId === 19) {
            setSelectedNetwork(songbirdLogo);
          } else if (networkId === 14) {
            setSelectedNetwork(flareLogo);
          } else if (networkId === 31337) {
            setSelectedNetwork(null); 
          }

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    getCurrentNetworkId();
  }, [web3]);

  return (
    <StyledNav>
      <Logo>
        <img src="./logo.png" alt="Logo" />
        <span className="app-name">Flare Community Lazy Minting</span>
      </Logo>
      <NavLinks>
        <li>
          <Link to="/">
            <FiHome className="nav-icon" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/mint">
            <FiPlusCircle className="nav-icon" />
            Mint
          </Link>
        </li>
        <li>
          <Link to="/batch-mint">
            <FiPlusCircle className="nav-icon" />
            Batch Mint
          </Link>
        </li>
        <li>
          <Link to="/my-tokens">
            <FiFolder className="nav-icon" />
            My NFTs
          </Link>
        </li>
      
        <li>
          <Link to="/marketplace">
            <FaWallet className="nav-icon" />
            Marketplace
          </Link>
        </li>
        {account && (
          <li>
  <Link to="/token-list">
                <FaWallet className="nav-icon" />
              Connected Wallet: {account}
            </Link>
          </li>
        )}
      </NavLinks>
      <NetworkSelect value={currentNetworkId} onChange={handleNetworkChange}>
        <option value="19">Songbird</option>
        <option value="14">Flare</option>
        <option value="31337">Hardhat</option>
      </NetworkSelect>
      {selectedNetwork && <LogoImage src={selectedNetwork} alt="Selected Network" />}
    </StyledNav>
  );
};

export default NavBar;
