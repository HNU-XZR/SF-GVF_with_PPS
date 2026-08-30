# Prescribed-Speed Singularity-Free GVF Project Page

This folder is a build-free static website for GitHub Pages. It uses plain
HTML, CSS, and JavaScript and works from a repository subpath such as:

```text
https://YOUR-ACCOUNT.github.io/YOUR-REPOSITORY/
```

## 1. Preview locally

Run a local HTTP server from this directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. Do not rely on double-clicking
`index.html`, because browsers apply different restrictions to `file://` pages.

## 2. Edit links, videos, and comparison data

Edit:

```text
static/js/site-config.js
```

This file contains the venue, authors, resource links, all experiment-video
paths, default video selection, playback rates, and the paired experiment
metrics. Empty resource links are displayed as disabled `Coming Soon` buttons.

The comparison table is generated from `comparisonMetrics`. Each path stores
the experiment end time and three statistics for Constant PPS and
Curvature-Aware PPS:

```javascript
clover: {
  timeEnd: 60,
  constant: {
    meanPathError: 0.065,
    meanSpeed: 1.960,
    saturationTime: 0.450
  },
  curvature: {
    meanPathError: 0.063,
    meanSpeed: 1.931,
    saturationTime: 0.000
  }
}
```

The page calculates

```text
100 * (Curvature-Aware - Constant) / Constant
```

and displays the result to one decimal place.

## 3. Experiment video files

The interactive selector uses:

```text
static/videos/experiments/clover-constant-vd2p00.mp4
static/videos/experiments/clover-curvature-vc2p00.mp4
static/videos/experiments/helix-constant-vd3p00.mp4
static/videos/experiments/helix-curvature-vc3p00.mp4
static/videos/experiments/figure-eight-constant-vd4p50.mp4
static/videos/experiments/figure-eight-curvature-vc4p50.mp4
static/videos/experiments/ring-constant-vd5p00.mp4
static/videos/experiments/ring-curvature-vc5p00.mp4
```

The additional file

```text
static/videos/experiments/figure-eight-curvature-vc6p00.mp4
```

is used by the teaser and the standalone Curvature-Aware Path Following Video.
Playback rates `1`, `2`, and `4` are applied by the browser; separate accelerated
copies are not required.

Recommended encoding:

```bash
ffmpeg -i input.mp4 -vf "scale=1280:720,fps=30" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow \
  -movflags +faststart -an output.mp4
```

Keep every file below 25 MiB when uploading through GitHub's web interface.
Regular Git pushes accept files up to 100 MiB. Avoid Git LFS for files served
directly by GitHub Pages.

## 4. Publish with GitHub Pages

1. Create a public GitHub repository.
2. Upload the contents of this folder so `index.html` is at the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/ (root)**, then save.

The resulting URL is normally:

```text
https://YOUR-ACCOUNT.github.io/YOUR-REPOSITORY/
```

## 5. Before public release

- Check the current conference anonymization policy.
- Replace anonymous author and affiliation text when appropriate.
- Fill the arXiv, code, and data links.
- Update the placeholder BibTeX entry after acceptance.
- Confirm publication permission for every video.
- Test the selector and table on desktop and mobile browsers.

## 6. Main files

```text
index.html                    Page content and section order
static/css/index.css          Typography, video frames, table, responsive layout
static/js/site-config.js      Authors, links, videos, metrics, defaults
static/js/index.js            Video selection, table generation, copy button
static/pdfs/paper.pdf         Local manuscript PDF
```


