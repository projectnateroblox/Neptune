import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./components/Sidebar";
import { RightSidebar } from "./components/RightSidebar";
import WindowControls from "./components/WindowsControls";
import Home from "./pages/Home";
import Clouds from "./pages/Clouds";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import ScriptDetails from "./pages/ScriptDetails";
import { useWorkspaceStore } from "./store/workspaceStore";
import { Script } from "./types";

// Create a QueryClient instance
const queryClient = new QueryClient();

const AppContent = (): JSX.Element => {
  const location = useLocation();
  const { workspace, setSelectedScript, toggleFavorite, setScripts } =
    useWorkspaceStore();
  const showWorkspace = location.pathname === "/";

  useEffect(() => {
    const fetchScripts = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3001/files");
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }
        const scripts = await response.json();
        console.log("Fetched scripts:", scripts);

        // Ensure each script has a language field
        const scriptsWithLanguage = scripts.map((script: Partial<Script>) => ({
          ...script,
          language: script.language || "lua", // Default to lua if not specified
        }));
        console.log("Scripts with language:", scriptsWithLanguage);
        setScripts(scriptsWithLanguage);
      } catch (err) {
        console.error("Error loading scripts:", err);
        toast.error(
          "Failed to connect to workspace server. Please ensure the server is running."
        );
      }
    };

    if (showWorkspace) {
      fetchScripts();
    }
  }, [setScripts, showWorkspace]);

  const handleMinimize = (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.electron?.minimizeWindow();
  };

  const handleMaximize = (): void => {
    // window.electron?.maximizeWindow()
    toast.warning("maximizing is very broken right now ;)");
  };

  const handleClose = (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.electron?.closeWindow();
  };

  return (
    <div className="flex h-screen bg-deep-900">
      <div className="bg-deep-800 h-9 flex items-center justify-between px-4 fixed top-0 left-0 w-full z-50 draggable">
        <div className="text-ocean-300 text-sm">Neptune Editor</div>
        <WindowControls
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
        />
      </div>
      <div className="flex flex-1 pt-9">
        <Sidebar />
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1 flex">
            <main
              className={`${showWorkspace ? "flex-1" : "w-full"} flex flex-col`}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clouds" element={<Clouds />} />
                <Route
                  path="/clouds/script/:slug"
                  element={<ScriptDetails />}
                />
                <Route path="/account" element={<Account />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            {showWorkspace && (
              <div className="w-64">
                <RightSidebar
                  workspace={workspace}
                  onSelectScript={setSelectedScript}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}
          </div>
        </div>
        <Toaster position="top-right" expand={true} richColors />
      </div>
    </div>
  );
};

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
