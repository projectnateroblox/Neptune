export interface Tab {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface MonacoTheme {
  base: string;
  inherit: boolean;
  colors: Record<string, string>;
  rules: Array<{
    token: string;
    foreground: string;
    fontStyle?: string;
  }>;
}
