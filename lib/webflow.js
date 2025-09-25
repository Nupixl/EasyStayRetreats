import fs from "fs";
import path from "path";

const WEBFLOW_HOME_PATH = path.join(
  process.cwd(),
  "Refrence",
  "easystayretreasts.webflow (1)",
  "index.html"
);

export const getWebflowHomepage = () => {
  return fs.readFileSync(WEBFLOW_HOME_PATH, "utf8");
};

export default getWebflowHomepage;
