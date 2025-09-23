import postData from "../../../data.json";

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
    const { markers, error } = parseMarkers(req.query);

    if (error) {
      return res.status(400).json({ success: false, error });
    }

    if (markers.length < 4) {
      return res
        .status(400)
        .json({ success: false, error: "Incomplete bounds payload" });
    }

    const calcLocation = (lat, lng) => {
      if (
        +lat < +markers[0].latitude &&
        +lat > +markers[2].latitude &&
        +lng > +markers[0].longitude &&
        +lng < +markers[3].longitude
      ) {
        return true;
      } else {
        return false;
      }
    };

    let result;
    const newP = new Promise((r) => {
      if (true) {
        setTimeout(() => {
          r(
            (result = postData
              .map((post) => {
                const res = calcLocation(
                  post.geolocation.lat,
                  post.geolocation.lng
                );
                if (res) {
                  return post;
                } else {
                  return null;
                }
              })
              .filter((e) => e !== null))
          );
        }, Math.floor(Math.random() * 800));
      }
    });
    newP
      .then((response) => res.json({ success: true, data: response }))
      .catch((err) => res.json({ success: false, data: null }));
  }
}
