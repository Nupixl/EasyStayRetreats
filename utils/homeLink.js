const NATIVE_HOME_URL = "https://www.easystayretreats.homes/";
const LOCAL_HOME_PATH = "/homepage";

const isLocalHomepageContext = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const { pathname } = window.location;
    if (!pathname) {
      return false;
    }
    return (
      pathname === LOCAL_HOME_PATH || pathname.startsWith(`${LOCAL_HOME_PATH}/`)
    );
  } catch (error) {
    console.warn("Unable to determine homepage context", error);
    return false;
  }
};

export const resolveHomepageHref = () => {
  if (isLocalHomepageContext()) {
    return LOCAL_HOME_PATH;
  }

  if (process.env.NEXT_PUBLIC_FORCE_LOCAL_HOMEPAGE === "true") {
    return LOCAL_HOME_PATH;
  }

  return NATIVE_HOME_URL;
};

export const HOMEPAGE_NATIVE_URL = NATIVE_HOME_URL;
export const HOMEPAGE_LOCAL_PATH = LOCAL_HOME_PATH;
export const isLocalHomepage = isLocalHomepageContext;

export default resolveHomepageHref;
