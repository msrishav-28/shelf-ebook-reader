import { toast } from "sonner";
import { importLocalFile, importSampleFile, type SampleFileName } from "@/db";
import { pickLocalPublication } from "@/lib/pick-local-file";

type GoToReader = (workId: string) => void;

export async function openLocalPublication(goToReader: GoToReader): Promise<void> {
  const file = await pickLocalPublication();
  if (!file) return;
  try {
    const { workId } = await importLocalFile(file);
    goToReader(workId);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "The file could not be opened.");
  }
}

export async function openSamplePublication(
  fileName: SampleFileName,
  goToReader: GoToReader,
): Promise<void> {
  try {
    const { workId } = await importSampleFile(fileName);
    goToReader(workId);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "The sample file could not be opened.");
  }
}
