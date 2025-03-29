import React, { useState } from "react";
import { X } from "lucide-react";

export interface Tab {
  id: string;
  name: string;
  language: string;
  content: string;
}

interface EditorTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabNameChange: (id: string, newName: string) => void;
  onTabReorder: (sourceId: string, targetId: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
  onTabNameChange,
  onTabReorder,
}) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

  const handleDoubleClick = (tab: Tab) => {
    // Split the name into base name and extension
    const lastDotIndex = tab.name.lastIndexOf(".");
    const baseName =
      lastDotIndex > 0 ? tab.name.substring(0, lastDotIndex) : tab.name;
    setEditingTabId(tab.id);
    setEditValue(baseName);
  };

  const handleEditSubmit = (tabId: string) => {
    if (editValue.trim()) {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return;

      // Get the original extension
      const lastDotIndex = tab.name.lastIndexOf(".");
      const extension =
        lastDotIndex > 0 ? tab.name.substring(lastDotIndex) : "";

      // Combine the new base name with the original extension
      const newName = editValue.trim() + extension;
      onTabNameChange(tabId, newName);
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === "Enter") {
      handleEditSubmit(tabId);
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    if (tabId !== draggedTabId) {
      setDragOverTabId(tabId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTabId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedTabId && targetId && draggedTabId !== targetId) {
      onTabReorder(draggedTabId, targetId);
    }
    setDraggedTabId(null);
    setDragOverTabId(null);
  };

  return (
    <div className="flex bg-deep-800 border-b border-deep-600 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          draggable
          onDragStart={(e) => handleDragStart(e, tab.id)}
          onDragOver={(e) => handleDragOver(e, tab.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, tab.id)}
          className={`group flex items-center h-9 px-3 border-r border-deep-600 cursor-pointer select-none ${
            activeTab === tab.id
              ? "bg-[#011627] text-ocean-300 border-t-2 border-[#00bcd4] border-r-0"
              : "bg-deep-800 text-ocean-400 hover:text-ocean-300"
          } ${
            draggedTabId === tab.id
              ? "opacity-50"
              : dragOverTabId === tab.id
              ? "border-l-2 border-ocean-300"
              : ""
          }`}
          onClick={() => onTabClick(tab.id)}
        >
          {editingTabId === tab.id ? (
            <div className="flex items-center">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSubmit(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className="bg-deep-700 text-ocean-300 px-1 rounded focus:outline-none focus:ring-1 focus:ring-ocean-300"
                autoFocus
              />
              <span className="text-ocean-400 ml-0.5">
                {tab.name.substring(tab.name.lastIndexOf("."))}
              </span>
            </div>
          ) : (
            <span
              className="max-w-[160px] truncate"
              onDoubleClick={() => handleDoubleClick(tab)}
            >
              {tab.name}
            </span>
          )}
          <button
            className="ml-2 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-deep-700 rounded transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
