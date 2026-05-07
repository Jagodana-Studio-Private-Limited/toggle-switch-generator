export const siteConfig = {
  name: "Toggle Switch Generator",
  title: "CSS Toggle Switch Generator — Free Online Tool",
  description:
    "Generate pure CSS toggle switches instantly. Customize size, colors, border-radius, and transition speed. Get copy-paste HTML, CSS, and React code for your projects.",
  url: "https://toggle-switch-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "ToggleLeft",
  brandAccentColor: "#6366f1",

  keywords: [
    "css toggle switch generator",
    "css toggle switch",
    "custom checkbox css",
    "toggle button generator",
    "css switch generator",
    "html toggle switch",
    "pure css toggle",
    "online toggle switch maker",
    "toggle switch code",
    "css ui component generator",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: ["https://twitter.com/jagodana"],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/toggle-switch-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Generate beautiful CSS toggle switches for your web projects. Customize every detail — size, colors, shape, and transition speed — then copy the code.",
    featuresTitle: "Features",
    features: [
      "Live preview",
      "Customizable colors",
      "Multiple sizes & shapes",
      "HTML, CSS & React export",
    ],
  },

  hero: {
    badge: "Free CSS Generator",
    titleLine1: "Generate CSS",
    titleGradient: "Toggle Switches",
    subtitle:
      "Customize size, colors, shape, and transition speed. Get copy-paste HTML, CSS, and React code instantly — no sign-up required.",
  },

  featureCards: [
    {
      icon: "🎨",
      title: "Full Color Control",
      description:
        "Pick any on/off color and knob color with a visual color picker for pixel-perfect switches.",
    },
    {
      icon: "📐",
      title: "Size & Shape Options",
      description:
        "Choose from small, medium, and large presets, with pill, rounded, or square border-radius styles.",
    },
    {
      icon: "⚡",
      title: "Instant Code Export",
      description:
        "Copy clean HTML, CSS, or React/JSX code with one click — ready to drop into any project.",
    },
  ],

  relatedTools: [
    {
      name: "Box Shadow Generator",
      url: "https://box-shadow-generator.tools.jagodana.com",
      icon: "🌫️",
      description: "Create CSS box shadows visually.",
    },
    {
      name: "Border Radius Generator",
      url: "https://border-radius-generator.tools.jagodana.com",
      icon: "⬜",
      description: "Fine-tune CSS border-radius with a visual editor.",
    },
    {
      name: "CSS Gradient Generator",
      url: "https://gradient-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Build beautiful CSS gradients visually.",
    },
    {
      name: "Loading Spinner Generator",
      url: "https://loading-spinner-generator.tools.jagodana.com",
      icon: "⭕",
      description: "Generate pure CSS loading spinners.",
    },
    {
      name: "CSS Animation Generator",
      url: "https://css-animation-generator.tools.jagodana.com",
      icon: "✨",
      description: "Build CSS keyframe animations visually.",
    },
    {
      name: "Color Contrast Checker",
      url: "https://color-contrast-checker.tools.jagodana.com",
      icon: "🔍",
      description: "Check WCAG color contrast ratios instantly.",
    },
  ],

  howToSteps: [
    {
      name: "Choose size and shape",
      text: "Select small, medium, or large size, and pick between pill, rounded, or square border-radius styles.",
      url: "",
    },
    {
      name: "Customize colors",
      text: "Use the color pickers to set the on-state color, off-state color, and knob color.",
      url: "",
    },
    {
      name: "Copy the code",
      text: "Switch between HTML, CSS, and React tabs to copy the exact code you need for your project.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "Is the generated toggle switch accessible?",
      answer:
        "Yes — the generated toggle switch uses a hidden <input type='checkbox'> as its foundation, which is fully accessible. Screen readers will announce it as a checkbox, and it is keyboard-navigable with Tab and Space keys. Focus styles are included in the generated CSS.",
    },
    {
      question: "Does the toggle switch work without JavaScript?",
      answer:
        "Yes — the toggle switch is 100% pure CSS and HTML. It works using the CSS :checked pseudo-class on a hidden checkbox input, requiring zero JavaScript for the toggle animation.",
    },
    {
      question: "Can I use this in React, Vue, or Angular?",
      answer:
        "Absolutely. The React tab generates a ready-to-use JSX component with useState. For Vue or Angular, copy the HTML and CSS tabs and adapt the template syntax — the CSS works identically in any framework.",
    },
    {
      question: "How do I change the toggle switch size?",
      answer:
        "Use the Size control to pick Small (44×24px), Medium (60×32px), or Large (80×44px). You can further customise by editing the generated CSS width and height values directly.",
    },
  ],

  pages: {
    "/": {
      title: "CSS Toggle Switch Generator — Free Online Tool",
      description:
        "Generate pure CSS toggle switches instantly. Customize size, colors, border-radius, and transition speed. Get copy-paste HTML, CSS, and React code.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
