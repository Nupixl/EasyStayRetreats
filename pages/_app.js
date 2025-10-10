import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import "../devlink/global.css";
import "../styles/animations.css";
import "../styles/hero-search.css";
import { DevLinkProvider } from "../devlink/DevLinkProvider";

export const Context = React.createContext();

function MyApp({ Component, pageProps }) {
  const [wishlist, setWishlist] = useState(false);
  const [wishlistData, setWishlistData] = useState(null);

  const values = { wishlist, setWishlist, wishlistData, setWishlistData };

  // Global error handling
  useEffect(() => {
    const handleError = (error) => {
      console.error('Global error:', error);
      // You can add error reporting here
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <DevLinkProvider>
      <Context.Provider value={values}>
        <Component {...pageProps} />
      </Context.Provider>
    </DevLinkProvider>
  );
}

export default MyApp;
