export const ROUTE_PATHS = {
  HOME: "/",
  RESEARCH_AREAS: "/areas",
  RESEARCH_AREA_DETAIL: "/areas/:areaId",
  PAPERS: "/papers",
  DATASETS: "/datasets",
  ALGORITHMS: "/algorithms",
  LEADERBOARD: "/leaderboard",
  AI4R: "/ai4r",
};

export const LAB_INFO = {
  name: "低空智能实验室",
  nameEn: "Low Altitude Intelligent Laboratory",
  institution: "低空智能实验室",
  location: "江苏省南京市",
  contactEmail: "contact@autosota.com",
};

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}