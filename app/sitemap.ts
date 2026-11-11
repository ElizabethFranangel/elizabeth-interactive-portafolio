import type { MetadataRoute } from "next";
import { site } from "./lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // The portfolio is one page; section fragments are not separate URLs.
  return [{ url: site.url }];
}
