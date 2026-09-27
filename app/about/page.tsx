import { StaticPageView, staticPageMetadata } from "@/components/page/StaticPageView";

export function generateMetadata() {
  return staticPageMetadata("about");
}

export default function AboutPage() {
  return <StaticPageView slug="about" />;
}
