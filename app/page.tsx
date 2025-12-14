import { contentEn } from "../content/en";
import { experiments } from "../lib/experiments";
import { PageShell } from "../components/PageShell";

export default function Page() {
  return <PageShell content={contentEn} experiments={experiments} />;
}
