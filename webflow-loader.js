const configModule = require("./next.config");
const config = configModule && configModule.default ? configModule.default : configModule;

const basePath = config.basePath || "";
const assetPrefix = config.assetPrefix || basePath;
const baseLessAssetPrefix =
  basePath && assetPrefix.endsWith(basePath)
    ? assetPrefix.slice(0, -basePath.length)
    : assetPrefix;

function normalizeSrc(src) {
  if (assetPrefix && src.startsWith(assetPrefix)) {
    return `${basePath}${src.slice(assetPrefix.length)}`.replace(/^\//, "");
  }

  if (basePath && src.startsWith(basePath)) {
    return src.replace(/^\//, "");
  }

  if (src.startsWith("/")) {
    return `${basePath}${src}`.replace(/^\//, "");
  }

  return src;
}

function cloudflareLoader({ src, width, quality }) {
  const normalizedSrc = normalizeSrc(src);

  if (normalizedSrc.startsWith("http://") || normalizedSrc.startsWith("https://")) {
    return normalizedSrc;
  }

  const params = [`width=${width}`];

  if (quality) {
    params.push(`quality=${quality}`);
  }

  const paramsString = params.join(",");
  const workerUrl = baseLessAssetPrefix || "/";

  return `${workerUrl.replace(/\/$/, "")}/cdn-cgi/image/${paramsString}/${normalizedSrc}`;
}

module.exports = cloudflareLoader;
module.exports.default = cloudflareLoader;
