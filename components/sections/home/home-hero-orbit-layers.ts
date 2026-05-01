/**
 * Hero dotted orbits — Figma `428:14900` (`hero`).
 * Ordered **outer → inner** (paint back → front). Paths, viewBoxes, opacities from Figma MCP
 * SVG exports; **layout widths** in `app/_styles/tokens.css` scale vs cream `428:16771`
 * (`--size-home-hero-monster-ellipse-width`) so orbit/cream proportions match Figma. Angles: −`node.rotation`.
 */
export type HomeHeroOrbitLayer = {
  readonly orbit: 1 | 2 | 3 | 4 | 5 | 6;
  readonly figmaNode: string;
  readonly figmaName: string;
  readonly viewBox: string;
  readonly pathD: string;
  /** Figma path `opacity`; omit when full (Ellipse 10 export has none). */
  readonly pathOpacity?: number;
};

export const HOME_HERO_ORBIT_LAYERS_OUTER_TO_INNER: readonly HomeHeroOrbitLayer[] = [
  {
    orbit: 6,
    figmaNode: "428:14909",
    figmaName: "Ellipse 6",
    viewBox: "0 0 1444.73 1408.72",
    pathOpacity: 0.2,
    pathD:
      "M1444.23 642.306C1444.23 1039.85 1131.71 1408.22 733.032 1408.22C536.47 1408.22 322.698 1375.73 192.523 1248.65C58.6711 1117.99 0.5 879.304 0.5 677.764C0.5 452.29 122.244 302.686 284.979 170.703C409.168 69.9807 560.473 0.5 733.032 0.5C1131.71 0.5 1444.23 244.763 1444.23 642.306Z",
  },
  {
    orbit: 5,
    figmaNode: "428:14908",
    figmaName: "Ellipse 5",
    viewBox: "0 0 1111.89 1084.18",
    pathOpacity: 0.3,
    pathD:
      "M1111.39 494.344C1111.39 800.238 870.919 1083.68 564.155 1083.68C412.908 1083.68 248.419 1058.68 148.254 960.904C45.2604 860.362 0.5 676.705 0.5 521.628C0.5 348.135 94.1771 233.02 219.395 131.464C314.954 53.9627 431.377 0.5 564.155 0.5C870.919 0.5 1111.39 188.45 1111.39 494.344Z",
  },
  {
    orbit: 4,
    figmaNode: "428:14906",
    figmaName: "Ellipse 11",
    viewBox: "0 0 874.889 853.091",
    pathOpacity: 0.4,
    pathD:
      "M874.389 388.985C874.389 629.618 685.22 852.591 443.902 852.591C324.923 852.591 195.527 832.926 116.731 756.007C35.711 676.915 0.5 532.44 0.5 410.448C0.5 273.969 74.1916 183.413 172.695 103.524C247.867 42.5567 339.452 0.5 443.902 0.5C685.22 0.5 874.389 148.352 874.389 388.985Z",
  },
  {
    orbit: 3,
    figmaNode: "428:14905",
    figmaName: "Ellipse 9",
    viewBox: "0 0 702.468 684.971",
    pathOpacity: 0.4,
    pathD:
      "M701.968 312.336C701.968 505.491 550.122 684.471 356.417 684.471C260.913 684.471 157.047 668.685 93.7986 606.942C28.7637 543.456 0.5 427.486 0.5 329.564C0.5 220.012 59.6519 147.324 138.72 83.1967C199.061 34.2588 272.576 0.5 356.417 0.5C550.122 0.5 701.968 119.18 701.968 312.336Z",
  },
  {
    orbit: 2,
    figmaNode: "428:14902",
    figmaName: "Ellipse 4",
    viewBox: "0 0 555.409 541.581",
    pathOpacity: 0.7,
    pathD:
      "M554.909 246.961C554.909 399.623 434.897 541.081 281.801 541.081C206.319 541.081 124.228 528.605 74.2391 479.806C22.8384 429.629 0.5 337.971 0.5 260.578C0.5 173.993 47.2511 116.543 109.743 65.8599C157.434 27.1815 215.537 0.5 281.801 0.5C434.897 0.5 554.909 94.2999 554.909 246.961Z",
  },
  {
    orbit: 1,
    figmaNode: "428:14903",
    figmaName: "Ellipse 10",
    viewBox: "0 0 415.465 405.127",
    pathD:
      "M414.965 184.749C414.965 298.876 325.247 404.627 210.795 404.627C154.366 404.627 92.9966 395.3 55.6259 358.819C17.1997 321.308 0.5 252.787 0.5 194.929C0.5 130.2 35.4502 87.2514 82.1681 49.3617C117.82 20.4465 161.257 0.5 210.795 0.5C325.247 0.5 414.965 70.6229 414.965 184.749Z",
  },
];
