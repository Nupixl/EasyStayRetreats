import os
import json
import asyncio
from importlib.machinery import SourceFileLoader
from importlib.util import spec_from_loader, module_from_spec


def load_api_key_from_cursor_mcp() -> str:
    mcp_config_path = os.path.expanduser("~/.cursor/mcp.json")
    with open(mcp_config_path, "r") as f:
        data = json.load(f)
    return data["mcpServers"]["google_maps_server"]["env"]["GOOGLE_MAPS_API_KEY"]


def load_google_maps_server_module():
    server_path = "/Users/elijahwilliams/Documents/MCP pixlpledge/gitbook and webflow/google_maps_server.py"
    loader = SourceFileLoader("google_maps_server", server_path)
    spec = spec_from_loader(loader.name, loader)
    module = module_from_spec(spec)
    loader.exec_module(module)
    return module


async def run_tests():
    api_key = load_api_key_from_cursor_mcp()
    os.environ["GOOGLE_MAPS_API_KEY"] = api_key

    gm = load_google_maps_server_module()

    # Test 1: Geocode
    address = "1600 Amphitheatre Parkway, Mountain View, CA"
    geocode_res = await gm.geocode(address)
    status = geocode_res.get("status")
    loc = None
    try:
        loc = geocode_res["results"][0]["geometry"]["location"]
    except Exception:
        pass

    # Test 2: Static Map URL (uses geocoded lat/lng if available)
    static_url = None
    if loc:
        center = f"{loc['lat']},{loc['lng']}"
        static = gm.static_map_url(center=center, zoom=15, size="640x400", markers=[f"color:red|{center}"])
        static_url = static.get("url")

    result = {
        "geocode_status": status,
        "geocode_location": loc,
        "static_map_url": static_url,
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(run_tests())



