import fs from "fs";
import path from "path";

const WEBFLOW_ROOT = path.join(
  process.cwd(),
  "Refrence",
  "easystayretreasts.webflow"
);

const EXTERNAL_PROTOCOL_REGEX = /^(?:[a-z]+:)?\/\//i;
const SKIP_PREFIXES = ["mailto:", "tel:", "sms:", "javascript:", "data:"];

function decodeEntities(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeRelativeDir(relativePath) {
  const dir = path.posix.dirname(relativePath.replace(/\\/g, "/"));
  if (!dir || dir === ".") {
    return "";
  }
  return dir;
}

function shouldSkipUrl(url) {
  const lower = url.toLowerCase();
  if (EXTERNAL_PROTOCOL_REGEX.test(lower) || lower.startsWith("//")) {
    return true;
  }
  return SKIP_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

function rewriteUrl(url, relativeDir) {
  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (shouldSkipUrl(trimmed)) {
    return trimmed;
  }

  let pathPart = trimmed;
  let hash = "";
  let query = "";

  const hashIndex = pathPart.indexOf("#");
  if (hashIndex !== -1) {
    hash = pathPart.slice(hashIndex);
    pathPart = pathPart.slice(0, hashIndex);
  }

  const queryIndex = pathPart.indexOf("?");
  if (queryIndex !== -1) {
    query = pathPart.slice(queryIndex);
    pathPart = pathPart.slice(0, queryIndex);
  }

  const isAbsolute = pathPart.startsWith("/");
  let baseDir = relativeDir;
  let workingPath = pathPart;

  if (isAbsolute) {
    baseDir = "";
    workingPath = workingPath.replace(/^\/+/, "");
  }

  if (!workingPath) {
    const normalized = path.posix.normalize(baseDir || ".");
    const finalPath = normalized === "." ? "/" : `/${normalized}`;
    return `${finalPath}${query}${hash}`;
  }

  const posixPath = path.posix.normalize(
    path.posix.join(baseDir || "", workingPath)
  );

  if (/\.html?$/i.test(posixPath)) {
    const withoutExt = posixPath.replace(/\.html?$/i, "");
    const finalPath = withoutExt === "index" ? "/" : `/${withoutExt}`;
    return `${finalPath}${query}${hash}`;
  }

  if (isAbsolute) {
    return `${pathPart}${query}${hash}`;
  }

  const assetPath = posixPath.replace(/^\/+/, "");
  return `/webflow/${assetPath}${query}${hash}`;
}

function rewriteAttributeUrls(html, relativeDir) {
  return html.replace(/(src|href)="([^"]*)"/gi, (fullMatch, attr, url) => {
    const newUrl = rewriteUrl(url, relativeDir);
    return `${attr}="${newUrl}"`;
  });
}

function rewriteSrcsetAttributes(html, relativeDir) {
  return html.replace(/(?:data-)?srcset="([^"]*)"/gi, (fullMatch, value) => {
    const rewritten = value
      .split(",")
      .map((entry) => {
        const trimmed = entry.trim();
        if (!trimmed) {
          return trimmed;
        }
        const parts = trimmed.split(/\s+/);
        const [url, ...rest] = parts;
        const rewrittenUrl = rewriteUrl(url, relativeDir);
        return [rewrittenUrl, ...rest].join(" ");
      })
      .join(", ");

    return fullMatch.startsWith("data-srcset")
      ? `data-srcset="${rewritten}"`
      : `srcset="${rewritten}"`;
  });
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

export function loadWebflowPage(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, "/");
  const absolutePath = path.join(WEBFLOW_ROOT, normalizedPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Webflow reference page not found: ${relativePath}`);
  }

  const rawHtml = fs.readFileSync(absolutePath, "utf8");

  const htmlTag = rawHtml.match(/<html[^>]*>/i)?.[0] || "";
  const headMatch = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  const pageId = htmlTag.match(/data-wf-page="([^"]+)"/i)?.[1] || null;
  const siteId = htmlTag.match(/data-wf-site="([^"]+)"/i)?.[1] || null;

  const headContent = headMatch ? headMatch[1] : "";
  let bodyContent = bodyMatch ? stripScripts(bodyMatch[1]) : "";

  const relativeDir = normalizeRelativeDir(normalizedPath);
  bodyContent = rewriteAttributeUrls(bodyContent, relativeDir);
  bodyContent = rewriteSrcsetAttributes(bodyContent, relativeDir);

  const titleMatch = headContent.match(/<title>([\s\S]*?)<\/title>/i);
  const descriptionMatch = headContent.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
  );

  const title = titleMatch ? decodeEntities(titleMatch[1].trim()) : "EasyStay Retreats";
  const description = descriptionMatch
    ? decodeEntities(descriptionMatch[1].trim())
    : "";

  return {
    title,
    description,
    body: bodyContent,
    pageId,
    siteId,
  };
}
