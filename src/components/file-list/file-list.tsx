import {
  CompressoFile,
  // createCompressoFileFromPath,
  // useCompressoFiles,
} from "@/lib/store/use-compresso-files";
import { FileItem } from "./file-item";
// import { Button } from "../ui/button";
// import { selectFiles } from "@/lib/select-files";
import { Separator } from "../ui/separator";
// import { usePostHog } from "posthog-js/react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useFileSelection } from "@/lib/store/store-hooks";

export const FileList = ({
  files,
  hasPaid,
  loadingAccess,
}: {
  files: CompressoFile[];
  hasPaid: boolean;
  loadingAccess: boolean;
}) => {
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
              <FileItem
                file={file}
                hasPaid={hasPaid}
                loadingAccess={loadingAccess}
              />
              <Separator />
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      {/* <AddMoreFilesButton /> */}
    </div>
  );
};

// const AddMoreFilesButton = () => {
//   const { addFile } = useCompressoFiles();
//   const posthog = usePostHog();

//   const handleOpenFileDialog = async () => {
//     const paths = await selectFiles();
//     if (!paths) return;

//     for (const path of paths) {
//       const file = await createCompressoFileFromPath(path);
//       addFile(file);
//     }
//     posthog.capture("added-files", {
//       count: paths.length,
//       location: "add-more-button",
//     });
//   };

//   return (
//     <div className="flex flex-col w-full justify-center items-center gap-2 p-2">
//       <div>
//         <Button
//           variant="ghost"
//           className="opacity-50 border"
//           onClick={handleOpenFileDialog}
//         >
//           Select More Files
//         </Button>
//       </div>
//     </div>
//   );
// };
