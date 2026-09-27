import { StaticPageView, staticPageMetadata } from "@/components/page/StaticPageView";

export function generateMetadata() {
  return staticPageMetadata("privacy-policy");
}

export default function PrivacyPolicyPage() {
  return <StaticPageView slug="privacy-policy" />;
}
