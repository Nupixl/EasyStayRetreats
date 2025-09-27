import { withBasePath } from "../../../utils/basePath";

// Redirect to new Supabase-based search endpoint

const parseMarkers = (query) => {
  const rawMarkers = query["data[]"] ?? query.data;

  const fromSerialized = (input) => {
    const serialized = Array.isArray(input) ? input : [input];

    try {
      const markers = serialized.map((entry) => {
        const value = typeof entry === "string" ? JSON.parse(entry) : entry;
        return {
          latitude: Number(value?.lat),
          longitude: Number(value?.lng),
        };
      });

      if (markers.some((marker) => !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude))) {
        return { error: "Invalid bounds payload" };
      }

      return { markers };
    } catch (_err) {
      return { error: "Invalid bounds payload" };
    }
  };

  if (rawMarkers) {
    return fromSerialized(rawMarkers);
  }

  const bracketEntries = Object.entries(query).filter(([key]) => key.startsWith("data["));

  if (bracketEntries.length === 0) {
    return { error: "Missing map bounds payload" };
  }

  const markerMap = {};

  for (const [key, value] of bracketEntries) {
    const match = key.match(/^data\[(\d+)\]\[(lat|lng)\]$/);
    if (!match) {
      continue;
    }

    const [, index, coordKey] = match;
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (!markerMap[index]) {
      markerMap[index] = {};
    }

    markerMap[index][coordKey] = Number(normalizedValue);
  }

  const markers = Object.keys(markerMap)
    .map((idx) => Number(idx))
    .sort((a, b) => a - b)
    .map((idx) => ({
      latitude: markerMap[idx]?.lat,
      longitude: markerMap[idx]?.lng,
    }));

  if (
    markers.length === 0 ||
    markers.some(
      (marker) =>
        !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude)
    )
  ) {
    return { error: "Invalid bounds payload" };
  }

  return { markers };
};

export default function handler(req, res) {
  if (req.method === "GET") {
    // Redirect to the new properties search endpoint
    return res.redirect(307, withBasePath("/api/properties/search"));
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
