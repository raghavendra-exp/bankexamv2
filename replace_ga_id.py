#!/usr/bin/env python3
"""
GA4 Measurement ID Replacement Script
======================================
Run this script ONCE from your project folder after you have your
Google Analytics 4 Measurement ID.

How to get your GA4 ID:
1. Go to analytics.google.com
2. Admin → Data Streams → choose your stream
3. Copy the Measurement ID (format: G-XXXXXXXXXX)

Usage:
  1. Open this file and replace YOUR_GA4_ID_HERE with your real ID
  2. Place this script in your project folder (same folder as index.html)
  3. Run: python3 replace_ga_id.py
"""

import glob, os

# ─── EDIT THIS LINE ───────────────────────────────────────────────────────────
GA4_ID = "YOUR_GA4_ID_HERE"   # e.g. "G-AB12CD34EF"
# ─────────────────────────────────────────────────────────────────────────────

PLACEHOLDER = "G-XXXXXXXXXX"

if GA4_ID == "YOUR_GA4_ID_HERE" or not GA4_ID.startswith("G-"):
    print("❌ Please edit this script and set GA4_ID to your real Measurement ID")
    print("   Example: GA4_ID = \"G-AB12CD34EF\"")
    exit(1)

html_files = glob.glob("*.html")
if not html_files:
    print("❌ No HTML files found. Run this script from your project folder.")
    exit(1)

print(f"Replacing {PLACEHOLDER} → {GA4_ID}")
print(f"Found {len(html_files)} HTML files\n")

total_replacements = 0
for fname in sorted(html_files):
    with open(fname, encoding="utf-8") as f:
        content = f.read()
    count = content.count(PLACEHOLDER)
    if count > 0:
        content = content.replace(PLACEHOLDER, GA4_ID)
        with open(fname, "w", encoding="utf-8") as f:
            f.write(content)
        total_replacements += count
        print(f"  ✅ {fname}  ({count} replacement{'s' if count > 1 else ''})")
    else:
        print(f"  —  {fname}  (already updated or no placeholder found)")

print(f"\n✅ Done — {total_replacements} total replacements across {len(html_files)} files")
print(f"   Google Analytics is now tracking with ID: {GA4_ID}")
