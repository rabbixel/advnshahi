import { StaticPageView, staticPageMetadata } from "@/components/page/StaticPageView";

export function generateMetadata() {
  return staticPageMetadata("disclaimer");
}

export default function DisclaimerPage() {
  return <StaticPageView slug="disclaimer" />;
}
