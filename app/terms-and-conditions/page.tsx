import { StaticPageView, staticPageMetadata } from "@/components/page/StaticPageView";

export function generateMetadata() {
  return staticPageMetadata("terms-and-conditions");
}

export default function TermsAndConditionsPage() {
  return <StaticPageView slug="terms-and-conditions" />;
}
