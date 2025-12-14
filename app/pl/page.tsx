import { contentPl } from "../../content/pl";
import { experiments } from "../../lib/experiments";
import { PageShell } from "../../components/PageShell";

export default function Page() {
  return <PageShell content={contentPl} experiments={experiments} />;
}
