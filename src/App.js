import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3Provider from './utils/Web3Provider';
import BatchMint from './components/Batch/BatchMinting';
import NavBar from './components/Nav/NavBar';
import Mint from './components/Mint/Mint';
import MyTokens from './components/MyNFTs/MyTokens';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer.js';
// import DeployContract from './components/deploy/DeployContract.js';
import TokenList from './components/Wallet/TokenList.js';
import MarketList from './components/Marketplace/Listing.js';
function App() {
  return (
    <Web3Provider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/batch-mint" element={<BatchMint />} />
          <Route path="/my-tokens" element={<MyTokens />} />
          <Route path="/token-list" element={<TokenList />} />
          <Route path="/marketplace" element={<MarketList />} />
          {/* <Route path="/deploy-contract" element={<DeployContract />} /> */}

        </Routes>
      </Router>
      <Footer />
    </Web3Provider>
  );
}

export default App;
