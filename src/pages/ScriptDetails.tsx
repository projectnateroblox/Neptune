import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Copy, ArrowLeft, Download, FileText, Key } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Editor,{useMonaco} from "@monaco-editor/react"
import { netThemeDark } from "@/utils/theme.ts";

const CORS_PROXY = "http://localhost:5641/proxy?url=";

interface ScriptDetails {
  script: {
    script: string;
    title: string;
    scriptType: string;
    key: boolean;
    isPatched: boolean;
    game: {
      name: string;
      imageUrl: string;
    };
    owner?: {
      username: string;
      profilePicture: string;
      verified: boolean;
    };
    createdAt: string;
    features?: string;
    views: number;
    likeCount: number;
    dislikeCount: number;
  };
}

const fetchScriptDetails = async (id: string): Promise<ScriptDetails> => {
  const response = await fetch(`${CORS_PROXY}https://scriptblox.com/api/script/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch script details");
  }
  return response.json();
};

const ScriptDetails = () => {
  const { slug } = useParams();
  const id = slug || "";
  const [showRawScript, setShowRawScript] = useState(true);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Register Lua language if not already registered
      if (!monaco.languages.getLanguages().some((lang) => lang.id === 'lua')) {
        monaco.languages.register({ id: 'lua' })
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      monaco.editor.defineTheme('net-theme-dark', netThemeDark)
      monaco.editor.setTheme('net-theme-dark')
    }
  }, [monaco]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['script', id],
    queryFn: () => fetchScriptDetails(id)
  });

  const handleCopy = async () => {
    if (data?.script?.script) {
      await navigator.clipboard.writeText(data.script.script);
      toast.success("Script copied to clipboard");
    } else {
      toast.error("Script content not available");
    }
  };

  const handleDownload = () => {
    if (data?.script?.script) {
      const element = document.createElement("a");
      const file = new Blob([data.script.script], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${data.script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.lua`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Script downloaded");
    } else {
      toast.error("Script content not available for download");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-800">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-ocean-400 border-b-transparent border-l-transparent border-r-transparent animate-spin mx-auto"></div>
          <p className="text-ocean-300">Loading script details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-800">
        <div className="max-w-md p-6 bg-deep-700 rounded-xl shadow-md border border-deep-600">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Error</h2>
          <p className="text-ocean-300 mb-4">Failed to load script details. </p>
          <p className="text-ocean-500 mb-4">Get access at ${CORS_PROXY}</p>
          <Link to="/clouds">
            <Button variant="outline" className="w-full bg-deep-700 border-ocean-400 text-ocean-300 hover:bg-ocean-400/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scripts
            </Button>
          </Link>
        </div>
      </div>
    );
  }


  const script = data?.script;
  if (!script) return null;

  const imageUrl = script.game.imageUrl.startsWith("/")
    ? `https://scriptblox.com${script.game.imageUrl}`
    : script.game.imageUrl;

  const ownerImageUrl = script.owner?.profilePicture
    ? script.owner.profilePicture.startsWith("/")
      ? `https://scriptblox.com${script.owner.profilePicture}`
      : script.owner.profilePicture
    : "https://scriptblox.com/images/default-avatar.png";

  return (
    <div className="min-h-screen bg-deep-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/clouds" className="inline-flex items-center text-ocean-300 hover:text-ocean-400 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scripts
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deep-700 rounded-xl shadow-lg overflow-hidden border border-deep-600"
        >
          <div className="relative h-64 overflow-hidden">
            <img src={imageUrl} alt={script.game.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-900/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-0.5 bg-ocean-500/80 text-white text-xs rounded-full backdrop-blur-sm">
                  {script.scriptType.toUpperCase()}
                </span>
                {script.key && (
                  <span className="px-2 py-0.5 bg-ocean-500/80 text-white text-xs rounded-full backdrop-blur-sm flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    KEY SYSTEM
                  </span>
                )}
                {script.isPatched && (
                  <span className="px-2 py-0.5 bg-red-500/80 text-white text-xs rounded-full backdrop-blur-sm">
                    PATCHED
                  </span>
                )}
              </div>
              <h1 className="text-white text-3xl font-bold">{script.title}</h1>
              <p className="text-ocean-300">{script.game.name}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={ownerImageUrl}
                alt={script.owner?.username || "Unknown"}
                className="w-12 h-12 rounded-full border-2 border-ocean-400"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://scriptblox.com/images/default-avatar.png";
                }}
              />
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-white">{script.owner?.username || "Unknown"}</span>
                  {script.owner?.verified && (
                    <span className="ml-1 w-4 h-4 bg-ocean-400 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                  )}
                </div>
                <p className="text-sm text-ocean-300">
                  Created {new Date(script.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {script.features && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">Features</h2>
                <div className="prose prose-invert">
                  {script.features.split('\n').map((feature: string, index: number) => (
                    <p key={index} className="mb-1 text-ocean-300">{feature}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCopy}
                className="bg-ocean-400 text-white hover:bg-ocean-500"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Script
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="bg-ocean-400 text-white hover:text-white hover:bg-ocean-500 border-0"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Script
              </Button>
              <Button
                onClick={() => setShowRawScript(!showRawScript)}
                variant="secondary"
                className="bg-deep-600 text-ocean-300 hover:bg-deep-700 border-ocean-400"
              >
                <FileText className="mr-2 h-4 w-4" />
                {showRawScript ? "Hide Raw Script" : "View Raw Script"}
              </Button>
            </div>

            {showRawScript && script.script && (
              <Card className="mt-4 bg-deep-800 border-deep-600">
                <CardContent className="p-4">
                  <div className="text-ocean-300 rounded-md overflow-x-auto">
                    <Editor
                        height="200px"
                        defaultLanguage="lua"
                        value={script.script}
                        theme="net-theme-dark"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          wordWrap: "on",
                          renderLineHighlight: "none",
                        }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-deep-600">
              <div className="text-sm text-ocean-300 flex items-center space-x-4">
                <span>{script.views} views</span>
                <span>👍 {script.likeCount}</span>
                <span>👎 {script.dislikeCount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScriptDetails;