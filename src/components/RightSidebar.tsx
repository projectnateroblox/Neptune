import { useState } from "react";
import {
  Star,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
} from "lucide-react";
import { WorkspaceState } from "../types";

interface SidebarProps {
  workspace: WorkspaceState;
  onSelectScript: (scriptId: string) => void;
  onToggleFavorite: (scriptId: string) => void;
}

export function RightSidebar({
  workspace,
  onSelectScript,
  onToggleFavorite,
}: SidebarProps) {
  const favoriteScripts = workspace.scripts.filter(
    (script) => script.isFavorite
  );
  console.log("Favorite scripts:", favoriteScripts);

  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >(Object.fromEntries(workspace.folders.map((folder) => [folder.id, true])));

  const handleScriptSelect = (scriptId: string) => {
    console.log("Script selected in sidebar:", scriptId);
    onSelectScript(scriptId);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <div className="w-64 bg-deep-800 border-l border-deep-600 h-full p-4 text-ocean-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Workspace</h2>
      </div>

      {/* Favorites Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Star size={16} className="text-ocean-400 mr-2" />
          <span className="text-sm font-medium">Favorites</span>
        </div>
        <div className="pl-6">
          {favoriteScripts.map((script) => (
            <div
              key={script.id}
              className="flex items-center py-1.5 px-2 hover:bg-deep-700 rounded-md cursor-pointer group transition-colors duration-150"
              onClick={() => handleScriptSelect(script.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <File size={14} className="text-ocean-400 flex-shrink-0" />
                <span className="text-sm truncate">{script.name}</span>
              </div>
              <Star
                size={14}
                className="text-yellow-400 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(script.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Folders Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Folder size={16} className="text-ocean-400 mr-2" />
            <span className="text-sm font-medium">Folders</span>
          </div>
          <button
            className="p-1 hover:bg-deep-700 rounded-md text-ocean-400 hover:text-ocean-300 transition-colors duration-150"
            title="New Folder"
          >
            <Plus size={14} />
          </button>
        </div>
        {workspace.folders.map((folder) => (
          <div key={folder.id} className="mb-1">
            <div
              className="flex items-center py-1.5 px-2 hover:bg-deep-700 rounded-md cursor-pointer group transition-colors duration-150"
              onClick={() => toggleFolder(folder.id)}
            >
              {expandedFolders[folder.id] ? (
                <ChevronDown
                  size={14}
                  className="text-ocean-400 mr-2 transition-transform duration-150"
                />
              ) : (
                <ChevronRight
                  size={14}
                  className="text-ocean-400 mr-2 transition-transform duration-150"
                />
              )}
              <Folder size={14} className="text-ocean-400 mr-2" />
              <span className="text-sm truncate">{folder.name}</span>
            </div>
            {expandedFolders[folder.id] && (
              <div className="pl-8 mt-1 space-y-1">
                {workspace.scripts
                  .filter((script) => script.folderId === folder.id)
                  .map((script) => (
                    <div
                      key={script.id}
                      className="flex items-center py-1.5 px-2 hover:bg-deep-700 rounded-md cursor-pointer group transition-colors duration-150"
                      onClick={() => handleScriptSelect(script.id)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File
                          size={14}
                          className="text-ocean-400 flex-shrink-0"
                        />
                        <span className="text-sm truncate">{script.name}</span>
                      </div>
                      <Star
                        size={14}
                        className={`${
                          script.isFavorite
                            ? "text-yellow-400"
                            : "text-ocean-400"
                        } opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(script.id);
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
