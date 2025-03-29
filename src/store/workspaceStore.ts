import { create } from "zustand";
import { Script, Folder, WorkspaceState } from "../types";

const PROJECT_FOLDERS: Folder[] = [{ id: "src", name: "scripts" }];

interface WorkspaceStore {
  workspace: WorkspaceState;
  setScripts: (scripts: Script[]) => void;
  setSelectedScript: (scriptId: string) => void;
  toggleFavorite: (scriptId: string) => void;
  updateScriptContent: (scriptId: string, content: string) => void;
  createNewScript: (name: string, folderId: string | null) => void;
  createNewFolder: (name: string) => void;
}

// Load favorite status from localStorage
const loadFavoriteStatus = (): Record<string, boolean> => {
  const saved = localStorage.getItem("script-favorites");
  return saved ? JSON.parse(saved) : {};
};

// Save favorite status to localStorage
const saveFavoriteStatus = (favorites: Record<string, boolean>) => {
  localStorage.setItem("script-favorites", JSON.stringify(favorites));
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspace: {
    scripts: [],
    folders: PROJECT_FOLDERS,
    selectedScriptId: null,
    selectedFolderId: null,
  },
  setScripts: (scripts) => {
    const favorites = loadFavoriteStatus();
    console.log("Loaded favorites from localStorage:", favorites);
    const scriptsWithFavorites = scripts.map((script) => ({
      ...script,
      isFavorite: favorites[script.id] || false,
    }));
    console.log("Scripts with favorites:", scriptsWithFavorites);
    set((state) => ({
      workspace: {
        ...state.workspace,
        scripts: scriptsWithFavorites,
      },
    }));
  },
  setSelectedScript: (scriptId) => {
    console.log("Setting selected script:", scriptId);
    set((state) => ({
      workspace: {
        ...state.workspace,
        selectedScriptId: scriptId,
      },
    }));
  },
  toggleFavorite: (scriptId) =>
    set((state) => {
      const newScripts = state.workspace.scripts.map((script) =>
        script.id === scriptId
          ? { ...script, isFavorite: !script.isFavorite }
          : script
      );

      // Update localStorage
      const favorites = newScripts.reduce(
        (acc, script) => ({
          ...acc,
          [script.id]: script.isFavorite,
        }),
        {}
      );
      saveFavoriteStatus(favorites);

      return {
        workspace: {
          ...state.workspace,
          scripts: newScripts,
        },
      };
    }),
  updateScriptContent: (scriptId, content) =>
    set((state) => ({
      workspace: {
        ...state.workspace,
        scripts: state.workspace.scripts.map((script) =>
          script.id === scriptId
            ? { ...script, content, updatedAt: new Date() }
            : script
        ),
      },
    })),
  createNewScript: (name, folderId) =>
    set((state) => {
      const newScript: Script = {
        id: `script-${Date.now()}`,
        name,
        content: "",
        isFavorite: false,
        folderId,
        updatedAt: new Date(),
      };
      return {
        workspace: {
          ...state.workspace,
          scripts: [...state.workspace.scripts, newScript],
          selectedScriptId: newScript.id,
        },
      };
    }),
  createNewFolder: (name) =>
    set((state) => {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name,
      };
      return {
        workspace: {
          ...state.workspace,
          folders: [...state.workspace.folders, newFolder],
        },
      };
    }),
}));
