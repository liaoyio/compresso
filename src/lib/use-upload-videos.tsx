import { useDropzone } from "react-dropzone";

export const useUploadVideos = (
  handleDrop: (acceptedFiles: File[]) => void
) => {
  return useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length > 0) {
        handleDrop(acceptedFiles);
      }
      if (fileRejections.length > 0) {
        // setErrorModalOpen(true);
      }
    },
    accept: {
      "video/*": [],
      "video/mp4": [],
      "video/avi": [],
      "video/x-msvideo": [],
      "video/x-matroska": [],
      "video/quicktime": [],
      "video/x-flv": [],
      "video/x-ms-wmv": [],
      "video/x-ms-wmx": [],
      "video/x-ms-wvx": [],
      "video/mpeg": [],
      "video/mp2t": [],
      "video/webm": [],
      "video/ogg": [],
      "video/3gpp": [],
      "video/x-ms-asf": [],
      "video/x-mxf": [],
      "video/dvd": [],
      "image/gif": [],
    },
    multiple: true,
    // maxSize: 1_900_000_000, // 2e+9, // 2 * 1024 * 1024 * 1024, // 2GB
    // maxSize: 100,
    // maxFiles: 1,
  });
};
