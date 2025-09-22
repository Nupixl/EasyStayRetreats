import os
import json
import asyncio
from importlib.machinery import SourceFileLoader
from importlib.util import spec_from_loader, module_from_spec


def load_api_key() -> str:
    with open(os.path.expanduser("~/.cursor/mcp.json"), "r") as f:
        cfg = json.load(f)
    return cfg["mcpServers"]["google_maps_server"]["env"]["GOOGLE_MAPS_API_KEY"]


def load_server_module():
    path = "/Users/elijahwilliams/Documents/MCP pixlpledge/gitbook and webflow/google_maps_server.py"
    loader = SourceFileLoader("google_maps_server", path)
    spec = spec_from_loader(loader.name, loader)
    module = module_from_spec(spec)
    loader.exec_module(module)
    return module


async def main():
    os.environ["GOOGLE_MAPS_API_KEY"] = load_api_key()
    gm = load_server_module()

    # 1) Directions SF -> SJ
    directions_res = await gm.directions(
        origin="San Francisco, CA",
        destination="San Jose, CA",
        mode="driving",
    )

    # 2) Distance matrix SF & Oakland -> SJ & Palo Alto
    dm_res = await gm.distance_matrix(
        origins=["San Francisco, CA", "Oakland, CA"],
        destinations=["San Jose, CA", "Palo Alto, CA"],
        mode="driving",
        units="imperial",
    )

    # 3) Places text search
    places_res = await gm.places_text_search(
        query="coffee near Mountain View CA",
        radius=2000,
        location="37.3861,-122.0839",
        opennow=True,
        type="cafe",
    )

    # 4) If we have a place_id, fetch details
    details_res = None
    try:
        first_place_id = places_res.get("results", [{}])[0].get("place_id")
        if first_place_id:
            details_res = await gm.place_details(
                place_id=first_place_id,
                fields=["name", "formatted_address", "geometry", "rating", "opening_hours"],
            )
    except Exception:
        details_res = None

    # 5) Reverse geocode center of Googleplex
    rev_res = await gm.reverse_geocode(37.4225123, -122.0855885)

    # 6) Static map URL for Googleplex with marker
    static_res = gm.static_map_url(
        center="37.4225123,-122.0855885",
        zoom=15,
        size="640x400",
        markers=["color:red|37.4225123,-122.0855885"],
    )

    # Redact API key from static map URL
    redacted_url = None
    try:
        from urllib.parse import urlsplit, parse_qsl, urlencode, urlunsplit
        if isinstance(static_res, dict):
            url = static_res.get("url")
            if url:
                parts = urlsplit(url)
                qs = dict(parse_qsl(parts.query))
                if "key" in qs:
                    qs["key"] = "REDACTED"
                redacted_url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(qs), parts.fragment))
    except Exception:
        redacted_url = static_res.get("url") if isinstance(static_res, dict) else None

    print(json.dumps({
        "directions_status": directions_res.get("status"),
        "distance_matrix_status": dm_res.get("status"),
        "places_status": places_res.get("status"),
        "place_details_status": details_res.get("status") if isinstance(details_res, dict) else None,
        "reverse_geocode_status": rev_res.get("status"),
        "static_map_url": redacted_url,
    }, indent=2))


if __name__ == "__main__":
    asyncio.run(main())


