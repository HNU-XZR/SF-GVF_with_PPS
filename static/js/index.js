(function () {
  "use strict";

  const config = window.PAPER_SITE || {};

  function configureIdentity() {
    const venue = document.getElementById("venue");
    if (venue && config.venue) venue.textContent = config.venue;

    const container = document.getElementById("authors");
    if (!container || !Array.isArray(config.authors) || config.authors.length === 0) return;

    container.replaceChildren();
    config.authors.forEach(function (author, index) {
      const element = document.createElement("span");
      element.textContent = author;
      container.appendChild(element);
      if (index < config.authors.length - 1) {
        container.appendChild(document.createTextNode(" · "));
      }
    });
  }

  function configureLinks() {
    document.querySelectorAll(".js-resource-link").forEach(function (link) {
      const key = link.dataset.linkKey;
      const label = link.dataset.label || key;
      const url = config.links && typeof config.links[key] === "string"
        ? config.links[key].trim()
        : "";

      if (url) {
        link.href = url;
        link.setAttribute("aria-label", label);
        if (/^https?:\/\//i.test(url)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        return;
      }

      link.removeAttribute("href");
      link.classList.add("is-placeholder");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", label + " link will be added later");
      const textElement = link.querySelector("span:last-child");
      if (textElement) textElement.textContent = label + " · Soon";
      link.addEventListener("click", function (event) { event.preventDefault(); });
    });
  }

  function setVideoAvailability(video, url) {
    const frame = video.closest(".video-frame");
    const badge = frame ? frame.querySelector(".placeholder-badge") : null;
    const source = video.querySelector("source");
    const available = Boolean(url && source);

    if (frame) frame.classList.toggle("is-video-missing", !available);
    if (badge) badge.hidden = available;

    if (!available) {
      video.pause();
      video.removeAttribute("autoplay");
      if (source) source.removeAttribute("src");
      video.load();
      return false;
    }

    source.src = url;
    video.load();
    video.addEventListener("error", function () {
      if (frame) frame.classList.add("is-video-missing");
      if (badge) badge.hidden = false;
    });
    return true;
  }

  function configureVideos() {
    document.querySelectorAll(".js-config-video").forEach(function (video) {
      const key = video.dataset.videoKey;
      const url = config.videos && typeof config.videos[key] === "string"
        ? config.videos[key].trim()
        : "";
      setVideoAvailability(video, url);
    });
  }

  function typesetElement(element) {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== "function") return;
    if (typeof window.MathJax.typesetClear === "function") {
      window.MathJax.typesetClear([element]);
    }
    window.MathJax.typesetPromise([element]).catch(function () {});
  }

  function configureVideoExplorer() {
    const pathSelect = document.getElementById("experiment-path-select");
    const ppsSelect = document.getElementById("experiment-pps-select");
    const rateSelect = document.getElementById("experiment-rate-select");
    const playButton = document.getElementById("experiment-play-button");
    const status = document.getElementById("experiment-video-status");
    const video = document.getElementById("experiment-video");
    const missingBadge = document.getElementById("experiment-video-missing");
    const experiments = config.experiments || {};

    if (!pathSelect || !ppsSelect || !rateSelect || !playButton || !status || !video) return;

    Object.entries(experiments).forEach(function ([key, experiment]) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = experiment.label;
      pathSelect.appendChild(option);
    });

    const rates = Array.isArray(config.playbackRates) && config.playbackRates.length > 0
      ? config.playbackRates
      : [1, 2, 4];
    rates.forEach(function (rate) {
      const option = document.createElement("option");
      option.value = String(rate);
      option.textContent = `×${rate}`;
      rateSelect.appendChild(option);
    });

    const defaults = config.defaultExperiment || {};
    if (experiments[defaults.path]) pathSelect.value = defaults.path;
    if (["constant", "curvature"].includes(defaults.ppsType)) ppsSelect.value = defaults.ppsType;
    if (rates.includes(Number(defaults.playbackRate))) {
      rateSelect.value = String(defaults.playbackRate);
    }

    function readSelection() {
      const experiment = experiments[pathSelect.value];
      const condition = experiment && experiment[ppsSelect.value];
      return {
        experiment: experiment,
        condition: condition,
        rate: Number(rateSelect.value) || 1
      };
    }

    function renderSelectionStatus() {
      const selection = readSelection();
      if (!selection.experiment || !selection.condition) {
        status.textContent = "The selected experiment is unavailable.";
        return;
      }

      const parameter = selection.condition.parameter === "v_c" ? "v_c" : "v_d";
      const value = Number(selection.condition.value).toFixed(1);
      status.replaceChildren();
      status.appendChild(document.createTextNode(
        `Selected: ${selection.experiment.mathLabel || selection.experiment.label} - ${selection.condition.label} - `
      ));
      const math = document.createElement("span");
      math.textContent = `\\(${parameter}=${value}\\,\\mathrm{m/s}\\)`;
      status.appendChild(math);
      status.appendChild(document.createTextNode(`, ×${selection.rate}`));
      typesetElement(status);
    }

    function setMissingState(message) {
      playButton.disabled = true;
      if (missingBadge) missingBadge.hidden = false;
      status.textContent = message;
    }

    function commitSelection(shouldPlay) {
      const selection = readSelection();
      const source = video.querySelector("source");
      if (!selection.experiment || !selection.condition ||
          !selection.condition.video || !source) {
        setMissingState("The selected experiment video is not available yet.");
        return;
      }

      const sourceChanged = source.getAttribute("src") !== selection.condition.video;
      if (sourceChanged) {
        video.pause();
        source.src = selection.condition.video;
        video.load();
      }

      video.defaultPlaybackRate = selection.rate;
      video.playbackRate = selection.rate;
      playButton.disabled = false;
      if (missingBadge) missingBadge.hidden = true;
      renderSelectionStatus();

      if (shouldPlay) {
        video.play().catch(function () {
          status.textContent = "Press the video player to start playback.";
        });
      }
    }

    pathSelect.addEventListener("change", renderSelectionStatus);
    ppsSelect.addEventListener("change", renderSelectionStatus);
    rateSelect.addEventListener("change", renderSelectionStatus);
    playButton.addEventListener("click", function () { commitSelection(true); });
    video.addEventListener("loadedmetadata", function () {
      const selection = readSelection();
      video.defaultPlaybackRate = selection.rate;
      video.playbackRate = selection.rate;
    });
    video.addEventListener("error", function () {
      setMissingState("The selected experiment video could not be loaded.");
    });

    commitSelection(false);
  }

  function configureComparisonTable() {
    const body = document.getElementById("paired-comparison-body");
    const experiments = config.experiments || {};
    const metrics = config.comparisonMetrics || {};
    if (!body) return;

    const metricDefinitions = [
      { key: "meanPathError", label: "Mean Path Error", unit: "m", kind: "performance" },
      { key: "meanSpeed", label: "Mean Speed", unit: "m/s", kind: "speed" },
      { key: "saturationTime", label: "Saturation Time", unit: "s", kind: "performance" }
    ];

    function isFiniteNumber(value) {
      return typeof value === "number" && Number.isFinite(value);
    }

    function formatValue(value) {
      return isFiniteNumber(value) ? value.toFixed(3) : "—";
    }

    function createChangeCell(constantValue, curvatureValue, kind) {
      const cell = document.createElement("td");
      cell.className = "relative-change-cell";
      if (!isFiniteNumber(constantValue) || !isFiniteNumber(curvatureValue) || constantValue === 0) {
        cell.textContent = "—";
        return cell;
      }

      const percentage = 100 * (curvatureValue - constantValue) / constantValue;
      const badge = document.createElement("span");
      const direction = percentage < -0.05 ? "↓" : percentage > 0.05 ? "↑" : "→";
      badge.textContent = `${direction} ${Math.abs(percentage).toFixed(1)}%`;
      badge.className = kind === "speed"
        ? "change-badge is-speed-change"
        : percentage <= 0
          ? "change-badge is-improvement"
          : "change-badge is-regression";
      cell.appendChild(badge);
      return cell;
    }

    body.replaceChildren();
    Object.entries(experiments).forEach(function ([pathKey, experiment], pathIndex) {
      const pathMetrics = metrics[pathKey] || {};
      const constant = pathMetrics.constant || {};
      const curvature = pathMetrics.curvature || {};

      metricDefinitions.forEach(function (definition, metricIndex) {
        const row = document.createElement("tr");
        row.className = pathIndex % 2 === 0 ? "path-group path-group-even" : "path-group";

        if (metricIndex === 0) {
          const pathCell = document.createElement("th");
          pathCell.scope = "rowgroup";
          pathCell.rowSpan = metricDefinitions.length;
          pathCell.className = "path-name-cell";
          pathCell.textContent = experiment.mathLabel || experiment.label;
          row.appendChild(pathCell);
        }

        const metricCell = document.createElement("th");
        metricCell.scope = "row";
        metricCell.className = "metric-name-cell";
        metricCell.textContent = `${definition.label} (${definition.unit})`;
        row.appendChild(metricCell);

        const constantCell = document.createElement("td");
        constantCell.textContent = formatValue(constant[definition.key]);
        row.appendChild(constantCell);

        const curvatureCell = document.createElement("td");
        curvatureCell.textContent = formatValue(curvature[definition.key]);
        row.appendChild(curvatureCell);

        row.appendChild(createChangeCell(
          constant[definition.key], curvature[definition.key], definition.kind
        ));
        body.appendChild(row);
      });
    });

    typesetElement(document.getElementById("paired-comparison-table"));
  }

  function configureCitationCopy() {
    const button = document.getElementById("copy-bibtex");
    const entry = document.getElementById("bibtex-entry");
    if (!button || !entry) return;

    button.addEventListener("click", async function () {
      const text = entry.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied";
      } catch (error) {
        const range = document.createRange();
        range.selectNodeContents(entry);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = "Selected";
      }
      window.setTimeout(function () { button.textContent = "Copy"; }, 1800);
    });
  }

  configureIdentity();
  configureLinks();
  configureVideos();
  configureVideoExplorer();
  configureComparisonTable();
  configureCitationCopy();

  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = "2026";
}());


