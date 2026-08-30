import { StudioGenerator } from "@/components/StudioGenerator";
import { requireUser } from "@/lib/auth";

export default async function StudioPage() {
  await requireUser();

  return <StudioGenerator />;
}
