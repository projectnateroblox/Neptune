export interface Script {
    id: string;
    name: string;
    content: string;
    language?: string;
    isFavorite: boolean;
    folderId: string | null;
    updatedAt: Date;
  }
  
  export interface Folder {
    id: string;
    name: string;
  }
  
  export interface WorkspaceState {
    scripts: Script[];
    folders: Folder[];
    selectedScriptId: string | null;
    selectedFolderId: string | null;
  }