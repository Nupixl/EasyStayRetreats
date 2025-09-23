import React, { useState } from "react";
import "../styles/globals.css";
import "../devlink/global.css";
import "../styles/animations.css";
import { DevLinkProvider } from "../devlink/DevLinkProvider";

export const Context = React.createContext();

function MyApp({ Component, pageProps }) {
  const [wishlist, setWishlist] = useState(false);
  const [wishlistData, setWishlistData] = useState(null);

  const values = { wishlist, setWishlist, wishlistData, setWishlistData };

  return (
    <DevLinkProvider>
      <Context.Provider value={values}>
        <Component {...pageProps} />
      </Context.Provider>
    </DevLinkProvider>
  );
}

export default MyApp;
