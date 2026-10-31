import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useMarkWhatsNewAsSeenOnMount } from "@/lib/use-release-notes";
import { BaseDirectory } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const WhatsNew = () => {
  const [markdown, setMarkdown] = useState("");
  useMarkWhatsNewAsSeenOnMount();

  useEffect(() => {
    const loadMarkdown = async () => {
      const text = await readTextFile("resources/release-notes.md", {
        baseDir: BaseDirectory.Resource,
      });

      setMarkdown(text);
    };

    loadMarkdown();
  }, []);

  return (
    <ReactMarkdown className="prose dark:prose-invert">
      {markdown}
    </ReactMarkdown>
  );
};
