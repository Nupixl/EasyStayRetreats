import os
import json
import urllib.parse
import urllib.request


def load_api_key_from_cursor_mcp() -> str:
    path = os.path.expanduser("~/.cursor/mcp.json")
    with open(path, "r") as f:
        data = json.load(f)
    return data["mcpServers"]["google_maps_server"]["env"]["GOOGLE_MAPS_API_KEY"]


def get_json(url: str, params: dict) -> dict:
    q = urllib.parse.urlencode(params)
    full = f"{url}?{q}"
    with urllib.request.urlopen(full) as resp:
        body = resp.read().decode("utf-8")
        return json.loads(body)


def main():
    key = load_api_key_from_cursor_mcp()

    # Test 1: Geocode
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    addr = "1600 Amphitheatre Parkway, Mountain View, CA"
    geo = get_json(geocode_url, {"address": addr, "key": key})
    status = geo.get("status")
    error_message = geo.get("error_message")
    loc = None
    try:
        loc = geo["results"][0]["geometry"]["location"]
    except Exception:
        pass

    # Test 2: Static map URL
    static_url = None
    if loc:
        center = f"{loc['lat']},{loc['lng']}"
        params = {
            "key": key,
            "center": center,
            "zoom": 15,
            "size": "640x400",
            "markers": f"color:red|{center}",
        }
        static_url = f"https://maps.googleapis.com/maps/api/staticmap?{urllib.parse.urlencode(params)}"

    print(json.dumps({
        "geocode_status": status,
        "error_message": error_message,
        "geocode_location": loc,
        "static_map_url": static_url,
    }, indent=2))


if __name__ == "__main__":
    main()


