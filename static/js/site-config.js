window.PAPER_SITE = {
  venue: "RAL 2026 Submission",
  authors: ["Anonymous Authors"],

  // Leave a URL empty to show a disabled "Coming Soon" button.
  links: {
    paper: "",
    arxiv: "",
    code: "",
    data: "",
    fullVideo: "",
  },

  // Standalone videos outside the interactive experiment selector.
  videos: {
    teaser: "static/videos/experiments/figure-eight-curvature-vc6p00.mp4",
    curvatureAware: "static/videos/experiments/figure-eight-curvature-vc6p00.mp4"
  },

  playbackRates: [1, 2, 4],
  defaultExperiment: {
    path: "clover",
    ppsType: "constant",
    playbackRate: 1
  },

  experiments: {
    clover: {
      label: "Clover",
      constant: {
        label: "Constant PPS",
        parameter: "v_d",
        value: 2.0,
        video: "static/videos/experiments/clover-constant-vd2p00.mp4"
      },
      curvature: {
        label: "Curvature-Aware PPS",
        parameter: "v_c",
        value: 2.0,
        video: "static/videos/experiments/clover-curvature-vc2p00.mp4"
      }
    },
    helix: {
      label: "Helix",
      constant: {
        label: "Constant PPS",
        parameter: "v_d",
        value: 3.0,
        video: "static/videos/experiments/helix-constant-vd3p00.mp4"
      },
      curvature: {
        label: "Curvature-Aware PPS",
        parameter: "v_c",
        value: 3.0,
        video: "static/videos/experiments/helix-curvature-vc3p00.mp4"
      }
    },
    figureEight: {
      label: "Figure “∞”",
      mathLabel: "Figure “\\(\\infty\\)”",
      constant: {
        label: "Constant PPS",
        parameter: "v_d",
        value: 4.5,
        video: "static/videos/experiments/figure-eight-constant-vd4p50.mp4"
      },
      curvature: {
        label: "Curvature-Aware PPS",
        parameter: "v_c",
        value: 4.5,
        video: "static/videos/experiments/figure-eight-curvature-vc4p50.mp4"
      }
    },
    ring: {
      label: "Ring",
      constant: {
        label: "Constant PPS",
        parameter: "v_d",
        value: 5.0,
        video: "static/videos/experiments/ring-constant-vd5p00.mp4"
      },
      curvature: {
        label: "Curvature-Aware PPS",
        parameter: "v_c",
        value: 5.0,
        video: "static/videos/experiments/ring-curvature-vc5p00.mp4"
      }
    }
  },

  // Values are transcribed from the final annotations in the experiment
  // videos and are evaluated over [5 s, T_end].
  comparisonMetrics: {
    windowStart: 5,
    clover: {
      timeEnd: 60,
      constant: { meanPathError: 0.065, meanSpeed: 1.960, saturationTime: 0.450 },
      curvature: { meanPathError: 0.063, meanSpeed: 1.931, saturationTime: 0.000 }
    },
    helix: {
      timeEnd: 40,
      constant: { meanPathError: 0.111, meanSpeed: 2.996, saturationTime: 1.630 },
      curvature: { meanPathError: 0.087, meanSpeed: 2.774, saturationTime: 0.000 }
    },
    figureEight: {
      timeEnd: 30,
      constant: { meanPathError: 0.234, meanSpeed: 4.415, saturationTime: 3.924 },
      curvature: { meanPathError: 0.118, meanSpeed: 4.054, saturationTime: 0.040 }
    },
    ring: {
      timeEnd: 20,
      constant: { meanPathError: 0.278, meanSpeed: 4.933, saturationTime: 4.487 },
      curvature: { meanPathError: 0.108, meanSpeed: 4.225, saturationTime: 0.130 }
    }
  }
};






