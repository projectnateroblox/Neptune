import { Copy, ExternalLink, User, Eye, Clock, ThumbsUp, ThumbsDown, Key, Check, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ScriptOwner {
  _id: string;
  username: string;
  verified: boolean;
  profilePicture: string;
  id: string;
}

interface ScriptGame {
  gameId: number;
  name: string;
  imageUrl: string;
}

interface Script {
  _id: string;
  title: string;
  game: ScriptGame;
  owner?: ScriptOwner;
  views: number;
  scriptType: string;
  isPatched: boolean;
  key?: boolean;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  id: string;
  slug: string;
  features?: string;
  script?: string;
}

interface ScriptsResponse {
  result: {
    totalPages: number;
    nextPage: number;
    max: number;
    scripts: Script[];
  };
}

interface ScriptDetailResponse {
  script: Script;
}

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

const fetchScripts = async (page: number = 1, searchQuery: string = ""): Promise<ScriptsResponse> => {
  const url = searchQuery 
    ? `${CORS_PROXY}https://scriptblox.com/api/script/search?q=${searchQuery}&max=5&mode=free`
    : `${CORS_PROXY}https://scriptblox.com/api/script/fetch?page=${page}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch scripts");
  }
  return response.json();
};

const fetchScriptDetails = async (id: string): Promise<ScriptDetailResponse> => {
  const response = await fetch(`${CORS_PROXY}https://scriptblox.com/api/script/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch script details");
  }
  return response.json();
};

const ScriptCard = ({ script }: { script: Script }) => {
  const imageUrl = script.game.imageUrl.startsWith("/") 
    ? `https://scriptblox.com${script.game.imageUrl}` 
    : script.game.imageUrl;

  const profilePicture = script.owner?.profilePicture 
    ? (script.owner.profilePicture.startsWith("/") 
        ? `https://scriptblox.com${script.owner.profilePicture}` 
        : script.owner.profilePicture)
    : "https://scriptblox.com/images/default-avatar.png";

  const handleCopy = async () => {
    try {
      const details = await fetchScriptDetails(script._id);
      if (details.script.script) {
        navigator.clipboard.writeText(details.script.script);
        toast.success("Script copied to clipboard");
      } else {
        toast.error("Script content not available");
      }
    } catch (error) {
      toast.error("Failed to copy script");
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <motion.div
      className="relative w-full"
      variants={{
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
        hover: { y: -5, transition: { duration: 0.3 } }
      }}
      initial="initial"
      animate="animate"
      whileHover="hover"
      layout="position"
    >
      <div className="relative overflow-hidden rounded-lg bg-deep-700 border border-deep-600 shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={script.game.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-900/90 to-transparent" />
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <Badge variant="secondary" className="bg-ocean-500/80 text-white border-none">
              Free
            </Badge>
            {script.key && (
              <Badge variant="secondary" className="bg-ocean-500/80 text-white border-none">
                <Key className="w-3 h-3 mr-1" />
                Key System
              </Badge>
            )}
            {script.isPatched && (
              <Badge variant="destructive" className="bg-red-500/80 border-none">
                Patched
              </Badge>
            )}
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Badge variant="secondary" className="bg-ocean-500/80 text-white border-none">
              <Eye className="w-3 h-3 mr-1" />
              {script.views}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <Avatar className="w-8 h-8 border-2 border-ocean-400">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback className="bg-deep-800">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm text-white">{script.owner?.username || "Unknown"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-ocean-300">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {script.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDown className="w-3 h-3" />
                {script.dislikeCount}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold line-clamp-1 text-white">{script.title}</h3>
            {script.owner?.verified && (
              <Check className="w-4 h-4 text-ocean-300 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center text-sm text-ocean-300 mb-4">
            <Clock className="w-3 h-3 mr-1" />
            {timeAgo(script.createdAt)}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-ocean-400 text-white hover:bg-ocean-500 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </button>
            <Link
              to={`/clouds/script/${script._id}`}
              className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg border border-ocean-400 text-ocean-300 hover:bg-ocean-400/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Clouds = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['scripts', currentPage, debouncedSearch],
    queryFn: () => fetchScripts(currentPage, debouncedSearch),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-800">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-ocean-400 border-b-transparent border-l-transparent border-r-transparent animate-spin mx-auto"></div>
          <p className="text-ocean-300">Loading scripts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-800">
        <div className="max-w-md p-6 bg-deep-700 rounded-xl shadow-md border border-deep-600">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Error</h2>
          <p className="text-ocean-300">Failed to load scripts. Please try again later.</p>
        </div>
      </div>
    );
  }

  const maxPaginationDisplay = 5;
  const totalPages = data?.result.totalPages || 0;
  const maxPage = Math.min(1400, totalPages);
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPaginationDisplay / 2));
  const endPage = Math.min(maxPage, startPage + maxPaginationDisplay - 1);
  
  if (endPage === maxPage) {
    startPage = Math.max(1, endPage - maxPaginationDisplay + 1);
  }

  return (
    <div className="h-screen bg-deep-800 px-4 sm:px-6 lg:px-8 overflow-y-auto overflow-x-hidden">
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-ocean-300 to-ocean-500">
            Script Hub
          </h1>
          <p className="text-ocean-300 max-w-2xl mx-auto mb-6">
            Powered by Scriptblox.com
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ocean-300 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-deep-700 border-deep-600 text-white placeholder:text-ocean-300/50 focus-visible:ring-ocean-400"
              />
            </div>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 overflow-hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {data?.result.scripts.map((script) => (
            <ScriptCard key={script._id} script={script} />
          ))}
        </motion.div>

        {!searchQuery && maxPage > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  aria-disabled={currentPage === 1}
                  className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} text-ocean-300 hover:bg-ocean-400/10 hover:text-ocean-300`}
                />
              </PaginationItem>
              
              {startPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => setCurrentPage(1)}
                      className="text-ocean-300 hover:bg-ocean-400/10 hover:text-ocean-300"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && <PaginationEllipsis className="text-ocean-300" />}
                </>
              )}
              
              {Array.from({ length: endPage - startPage + 1 }).map((_, i) => (
                <PaginationItem key={startPage + i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(startPage + i)}
                    isActive={currentPage === startPage + i}
                    className={currentPage === startPage + i 
                      ? 'bg-ocean-400 text-white hover:bg-ocean-500' 
                      : 'text-ocean-300 hover:bg-ocean-400/10 hover:text-ocean-300'
                    }
                  >
                    {startPage + i}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {endPage < maxPage && (
                <>
                  {endPage < maxPage - 1 && <PaginationEllipsis className="text-ocean-300" />}
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => setCurrentPage(maxPage)}
                      className="text-ocean-300 hover:bg-ocean-400/10 hover:text-ocean-300"
                    >
                      {maxPage}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(maxPage, p + 1))}
                  aria-disabled={currentPage === maxPage}
                  className={`${currentPage === maxPage ? 'pointer-events-none opacity-50' : ''} text-ocean-300 hover:bg-ocean-400/10 hover:text-ocean-300`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Clouds;