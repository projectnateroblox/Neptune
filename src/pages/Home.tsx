import { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Play, Trash2, FolderOpen, Save, Paperclip, Plus } from "lucide-react";
import EditorTabs, { Tab } from "../components/EditorTabs";
import { useWorkspaceStore } from "../store/workspaceStore";
import { netThemeDark } from "../utils/theme";
import { loadIntellisense } from "../utils/intellisense";

const Home = () => {
  const { workspace, updateScriptContent } = useWorkspaceStore();
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem("editor-tabs");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "welcome",
            name: "welcome.lua",
            language: "lua",
            content: '-- Welcome to Neptune Editor\n\nprint("Hello, Neptune!")',
          },
        ];
  });
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Register Lua language if not already registered
      if (!monaco.languages.getLanguages().some((lang) => lang.id === "lua")) {
        monaco.languages.register({ id: "lua" });
      }

      // Define the theme
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      monaco.editor.defineTheme("net-theme-dark", netThemeDark);
      monaco.editor.setTheme("net-theme-dark");

      // Load intellisense
      loadIntellisense(monaco);
    }
  }, [monaco]);

  useEffect(() => {
    localStorage.setItem("editor-tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    const selectedScript = workspace.scripts.find(
      (script) => script.id === workspace.selectedScriptId
    );
    console.log("Selected script:", selectedScript);
    console.log("Current tabs:", tabs);

    if (selectedScript) {
      const existingTab = tabs.find((tab) => tab.id === selectedScript.id);
      console.log("Existing tab:", existingTab);

      if (existingTab) {
        console.log("Switching to existing tab:", existingTab.id);
        setActiveTabId(existingTab.id);
      } else {
        console.log("Creating new tab for script:", selectedScript.id);
        const newTab: Tab = {
          id: selectedScript.id,
          name: selectedScript.name,
          language: selectedScript.language || "lua",
          content: selectedScript.content,
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
        setActiveTabId(newTab.id);
      }
    }
  }, [workspace.selectedScriptId, workspace.scripts, tabs]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    setIsEditorReady(true);
    editor.updateOptions({
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on",
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;

    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, content: value } : tab
      )
    );

    if (workspace.scripts.find((script) => script.id === activeTabId)) {
      updateScriptContent(activeTabId, value);
    }
  };

  const handleNewTab = () => {
    const newTab: Tab = {
      id: `file-${Date.now()}`,
      name: `untitled-${tabs.length + 1}.lua`,
      language: "lua",
      content: `-- Welcome to Neptune Executor\n\nprint("Hello, Neptune!")`,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleTabClose = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleTabNameChange = (tabId: string, newName: string) => {
    setTabs(
      tabs.map((tab) => (tab.id === tabId ? { ...tab, name: newName } : tab))
    );
  };

  const handleTabReorder = (sourceId: string, targetId: string) => {
    const sourceIndex = tabs.findIndex((tab) => tab.id === sourceId);
    const targetIndex = tabs.findIndex((tab) => tab.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newTabs = [...tabs];
    const [movedTab] = newTabs.splice(sourceIndex, 1);
    newTabs.splice(targetIndex, 0, movedTab);
    setTabs(newTabs);
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  const handleExecute = () => {
    fetch("http://localhost:2025/data/", {
      // make sure they match
      method: "post",
      headers: {
        "content-type": "text/plain"
      },
      body: activeTab.content
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Server returned: ", data);
      })
      .catch((error) => {
        console.error("ERM! ", error);
      });
  };

  const handleClear = () => {
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, content: "" } : tab
      )
    );
  };

  const handleOpen = () => {
    // Implement file open logic
    console.log("Open file");
  };

  const handleSave = () => {
    // Implement file save logic
    console.log("Save file");
  };

  const handleAttach = () => {
    fetch("http://localhost:2025/attach/", {
      // make sure they match
      method: "post",
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Server returned: ", data);
      })
      .catch((error) => {
        console.error("ERM! ", error);
      });
  };

  return (
    <div className="h-auto flex flex-col bg-deep-900 flex-1">
      <div className="flex items-center bg-deep-800 border-b border-deep-600">
        <div className="flex-1 flex items-center">
          <EditorTabs
            tabs={tabs}
            activeTab={activeTabId}
            onTabClick={setActiveTabId}
            onTabClose={handleTabClose}
            onTabNameChange={handleTabNameChange}
            onTabReorder={handleTabReorder}
          />
          <button
            onClick={handleNewTab}
            className="h-9 px-3 text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 transition-all duration-200 flex-shrink-0"
            title="New File"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative max-h-screen">
        {!isEditorReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep-900 text-ocean-300">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-300 mb-4"></div>
              <p className="text-lg">Loading Editor...</p>
            </div>
          </div>
        )}
        <Editor
          height="100%"
          defaultLanguage="lua"
          language={activeTab.language}
          value={activeTab.content}
          theme="net-theme-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          key={activeTab.id}
        />
      </div>

      <footer className="h-12 bg-deep-800 border-t border-deep-600 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleExecute}
            title="Execute (Ctrl+Enter)"
            className="p-2 text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 rounded-md transition-all duration-200"
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            title="Clear Editor"
            className="p-2 text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 rounded-md transition-all duration-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpen}
            title="Open File"
            className="p-2 text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 rounded-md transition-all duration-200"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            title="Save File"
            className="p-2 text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 rounded-md transition-all duration-200"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
        <div>
          <button
            onClick={handleAttach}
            title="Attach File"
            className="p-2 text-ocean-400 hover:text-ocean-300 hover:bg-deep-700 rounded-md transition-all duration-200"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
