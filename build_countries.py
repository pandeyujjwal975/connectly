import json
import re

with open("/tmp/connectly-codes.json", encoding="utf-8") as f:
    source = json.load(f)

def flag_from_iso(code):
    if not code or not re.fullmatch(r"[A-Z]{2}", code):
        return "🌐"
    return "".join(chr(ord(c) + 127397) for c in code)

countries = []

for item in source:
    name = (item.get("name") or "").strip()
    iso = (item.get("code") or "").strip().upper()
    dial = (item.get("dial_code") or "").strip()

    if not name or not iso or not dial:
        continue

    countries.append({
        "name": name,
        "iso2": iso,
        "dialCode": dial,
        "flag": flag_from_iso(iso)
    })

countries.sort(key=lambda x: x["name"].casefold())

with open("data/countries.json", "w", encoding="utf-8") as f:
    json.dump(countries, f, ensure_ascii=False, indent=2)

print(f"Created data/countries.json with {len(countries)} entries.")
print("India:", next((c for c in countries if c["iso2"] == "IN"), "Not found"))
