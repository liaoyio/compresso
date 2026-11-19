import {
  CompressoFile,
  // createCompressoFileFromPath,
  // useCompressoFiles,
} from "@/lib/store/use-compresso-files";
import { FileItem } from "./file-item";
// import { Button } from "../ui/button";
// import { selectFiles } from "@/lib/select-files";
import { Separator } from "../ui/separator";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useFileSelection } from "@/lib/store/store-hooks";

export const FileList = ({ files }: { files: CompressoFile[] }) => {
  const sortedFiles = files.sort(
    (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
  );

  const { selectFileId } = useFileSelection();

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <Separator />

      <RadioGroup.Root className="flex flex-col" onValueChange={selectFileId}>
        {sortedFiles.map((file) => (
          <RadioGroup.Item key={file.id} value={file.id} asChild>
            <div>
              <FileItem file={file} />
              <Separator />
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      {/* <AddMoreFilesButton /> */}
    </div>
  );
};

