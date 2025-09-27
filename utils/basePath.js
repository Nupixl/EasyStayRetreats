const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const normalise = (value) => {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "";

  const prefixed = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return prefixed.endsWith("/") ? prefixed.slice(0, -1) : prefixed;
};

const basePath = normalise(rawBasePath);

export const withBasePath = (input = "") => {
  if (!input) return basePath || "";

  const hasLeadingSlash = input.startsWith("/");
  const path = hasLeadingSlash ? input : `/${input}`;

  if (!basePath) return path;

  if (path === basePath || path.startsWith(`${basePath}/`)) return path;

  return `${basePath}${path}`;
};

export const getBasePath = () => basePath;
