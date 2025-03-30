import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 5641;

// Enable CORS for all requests
app.use(cors());

// Proxy endpoint
app.get("/proxy", (async (req: Request, res: Response) => {
  try {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    // Fetch the requested URL
    const response = await axios.get(targetUrl, {
      headers: { "User-Agent": "Electron-App" },
    });

    // Forward the response data
    res.json(response.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
}) as RequestHandler);

app.listen(PORT, () => {
  console.log(`CORS Proxy running at http://localhost:${PORT}`);
});

export const callFunctionProxy = (): void => {
    console.log("PROXY: Called");
}

export default callFunctionProxy