# Study Buddy brand assets

All files have transparent backgrounds. The SVG files are path-based vector artwork (not raster images embedded in SVG), so they scale cleanly.

## Files

- `study-buddy-logo.svg` — scalable full wordmark; best for the website navbar and footer.
- `study-buddy-logo.png` — 2× transparent PNG export of the full wordmark.
- `study-buddy-logo-1x.png` — source-resolution transparent PNG.
- `study-buddy-icon.svg` — scalable standalone open-book symbol; best for app icons and compact placements.
- `study-buddy-icon.png` — 1024×1024 transparent PNG.
- `study-buddy-icon-512.png` — 512×512 PNG.
- `study-buddy-icon-192.png` — 192×192 PNG.
- `apple-touch-icon.png` — 180×180 PNG for iOS home-screen bookmarks.
- `favicon-48.png` and `favicon-32.png` — PNG favicons.

## Suggested website usage

Use the SVG wordmark on light/cream backgrounds:

```html
<img src="/assets/study-buddy-logo.svg" alt="Study Buddy" height="48">
```

Use the book symbol as the favicon:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
```

The mark uses deep teal and muted gold. For best contrast, place it on cream, ivory, or other light backgrounds.
