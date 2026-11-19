import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { MainApp } from "./components/main-app";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getVersion } from "@tauri-apps/api/app";
import useCompressoStore from "./lib/store/compresso-store";

const queryClient = new QueryClient();

function App() {
  const { setLastVersion } = useCompressoStore((state) => ({
    setLastVersion: state.setLastVersion,
  }));

  useEffect(() => {
    getVersion().then((version) => {
      setLastVersion(version);
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="compresso-ui-theme">
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
