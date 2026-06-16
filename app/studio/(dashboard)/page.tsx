import { StudioDashboard } from "@/components/studio/StudioDashboard";
import { getCatalog } from "@/lib/blob-store";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const catalog = await getCatalog();
  return <StudioDashboard initial={catalog} />;
}
