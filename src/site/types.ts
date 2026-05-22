export interface DzineSiteGitHub {
  owner: string;
  repo: string;
  url?: string;
}

export interface DzineSiteNavItem {
  label: string;
  href: string;
}

export interface DzineSitePage {
  title: string;
  description: string;
  route: string;
  source: string;
  navLabel?: string;
  order?: number;
}

export interface DzineSiteConfig {
  name: string;
  title: string;
  description: string;
  sourceRoot?: string;
  outputDir?: string;
  theme?: string;
  assets?: string[];
  github?: DzineSiteGitHub;
  nav?: DzineSiteNavItem[];
  pages: DzineSitePage[];
}

export interface BuiltDzinePage {
  page: DzineSitePage;
  sourcePath: string;
  outputPath: string;
  route: string;
}

export interface DzineSiteBuildResult {
  config: DzineSiteConfig;
  outputDir: string;
  pages: BuiltDzinePage[];
}
