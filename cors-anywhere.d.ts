declare module "cors-anywhere" {
  interface CorsOptions {
    originWhitelist?: string[];
    requireHeader?: string[];
    removeHeaders?: string[];
  }

  interface CorsServer {
    listen(port: number, callback?: () => void): void;
  }

  function createServer(options?: CorsOptions): CorsServer;
  export = createServer;
}
