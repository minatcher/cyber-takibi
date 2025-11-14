Place your sound files here so Nuxt serves them from the site root `/<file>`.

Recommended files to copy from the built output:
- docs/_nuxt/assets/sounds/wind.mp3
- docs/_nuxt/assets/sounds/rain.mp3
- docs/_nuxt/assets/sounds/bonfire.mp3

After copying, the files will be available at:
- /assets/sounds/wind.mp3
- /assets/sounds/rain.mp3
- /assets/sounds/bonfire.mp3

If you want the app to use these static assets instead of the bundle's internal paths, update source code to reference `/assets/sounds/<name>.mp3` (or rebuild with correct `publicPath`).
