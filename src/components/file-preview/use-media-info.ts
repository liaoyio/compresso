import { FFSummary, getMediaInfo } from "@/lib/probe/get-media-info";
import { Ffprobe } from "@/lib/probe/probe-type";
import { useQuery } from "@tanstack/react-query";

/**
 * Returns the media info for a file. Cached.
 */

export type FFInfo = Ffprobe & { summary: FFSummary };

export const useMediaInfo = (path?: string) => {
  const { data: mediaInfo, isLoading } = useQuery<FFInfo | null>({
    queryKey: ["mediaInfo", path],
    queryFn: async () => {
      if (!path) return null;
      try {
        const info = await getMediaInfo(path);
        return info;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    enabled: !!path,
  });

  return { mediaInfo, isLoading };
};
