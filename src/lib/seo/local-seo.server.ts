import process from "node:process";
import { ApiError } from "@/lib/api";
import { loadCityPage, type StoreCityPage } from "@/lib/content";
import { PUBLIC_CITY_SLUGS } from "@/lib/seo/url-policy";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONFIGURED_CITIES = 24;

export const resolveConfiguredCitySlugs = () => {
  const configured = (process.env.WINIMI_PUBLIC_CITY_SLUGS || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => SAFE_SLUG.test(value));
  const source = configured.length ? configured : [...PUBLIC_CITY_SLUGS];
  return Array.from(new Set(source)).slice(0, MAX_CONFIGURED_CITIES);
};

export const collectPublishedCityPages = async (): Promise<StoreCityPage[]> => {
  const cities: StoreCityPage[] = [];
  const seenSlugs = new Set<string>();

  for (const slug of resolveConfiguredCitySlugs()) {
    try {
      const city = await loadCityPage(slug);
      if (!SAFE_SLUG.test(city.slug) || seenSlugs.has(city.slug)) continue;
      seenSlugs.add(city.slug);
      cities.push(city);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) continue;
      throw error;
    }
  }

  return cities;
};
