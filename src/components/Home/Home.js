import React from 'react';
import brand from '../../assets/logo.png';
import '../../index.css';
import MarketListings from '../Marketplace/MarketListings/MarketListings';


const Home = () => {
  return (
    <div style={styles.container}>
      <img src={brand} alt="Logo" style={{ ...styles.logo, ...styles.spinAnimation }} />
      <h1 style={styles.heading}>Welcome to the SGB/FLR Community Lazy Minting Dapp!</h1>
      <p style={styles.description}>Create unique and vibrant NFTs without any coding knowledge. Unleash the power of your creativity and let it shine in the digital world!</p>
      <p style={styles.description}>Our Dapp is more than a tool; it's a creative partner designed meticulously with you in mind. We've integrated state-of-the-art features to make the process of minting NFTs as seamless as possible. Whether you're an artist, a collector, or a digital explorer, we've got you covered.</p>
      <p style={styles.description}>Born out of a deep-seated love and respect for the Songbird/Flare Networks community, this platform serves as a bridge between your artistic vision and the world. We are here to empower you and provide the necessary tools to help you thrive in the flourishing NFT space.</p>

      <p style={{ ...styles.descriptionText, ...styles.fireAnimation }}>Get your 2 Free mints here!!</p>
      <button style={{ ...styles.button, ...styles.popButton }}>
        <a href="/mint" style={styles.buttonLink}>Click here to mint</a>
      </button>
      {/* Add more information or features of the dapp */}
  <MarketListings />
    </div>
  );
};

const spinAnimation = {
  animation: 'spin 5s linear infinite',
  transformStyle: 'preserve-3d'
};

const fireAnimation = {
  animation: 'fire 2s linear infinite',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#282c34',
  },

  logo: {
    width: '400px',
    marginBottom: '16px',
  },
  heading: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  description: {
    fontSize: '24px',
    marginBottom: '32px',
    textAlign: 'center',
    lineHeight: '1.5',
    color: 'white',
  },
  descriptionText: {
    fontSize: '60px',
    marginBottom: '32px',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  popText: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#61dafb',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    animation: 'popText 0.5s infinite alternate',
  },
  button: {
    padding: '0',
    border: 'none',
    backgroundColor: 'transparent',
  },
  buttonLink: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#61dafb',
    color: '#282c34',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'transform 0.3s ease-in-out',
  },
  popButton: {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  spinAnimation,
  fireAnimation,

};

export default Home;
