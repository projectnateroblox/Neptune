import express, { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'http'
import cors from 'cors'

const app = express()
const PORT = 3001

// Allow requests from Vite dev server
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// Rename __filename & __dirname to avoid conflicts
const filePath = fileURLToPath(import.meta.url)
const dirPath = path.dirname(filePath)

const projectDir = path.join(dirPath, '../scripts')

// Define TypeScript interface for file data
interface FileData {
  id: string
  name: string
  content: string
  isFavorite: boolean
  folderId: string
  updatedAt: Date
}

// API Route to fetch files
app.get('/files', async (_req: Request, res: Response) => {
  try {
    console.log(`SERVER (workspace): Reading directory: ${projectDir}`);

    // Ensure directory exists
    await fs.access(projectDir).catch(() => {
      throw new Error(`SERVER (workspace): Directory does not exist: ${projectDir}`);
    });

    const files = await fs.readdir(projectDir, { withFileTypes: true })

    const fileData: FileData[] = await Promise.all(
      files
        .filter(
          (file) => file.isFile() && (file.name.endsWith('.txt') || file.name.endsWith('.lua'))
        )
        .map(async (file) => {
          const filePath = path.join(projectDir, file.name)
          const content = await fs.readFile(filePath, 'utf8')
          return {
            id: file.name,
            name: file.name,
            content,
            isFavorite: false,
            folderId: 'src',
            updatedAt: new Date()
          }
        })
    )

    res.json(fileData)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('SERVER (workspace): Error reading directory:', errorMessage)
    res.status(500).json({ error: errorMessage })
  }
})

// Start the server
const server: Server = app.listen(PORT, () => {
  console.log(`Server (workspace) running on http://localhost:${PORT}`)
})

// Gracefully stop the server when Electron closes
export const stopServerWorkspace = (): void => {
  server.close(() => console.log('Server stopped'))
}

export const callFunction = (): void => {
  console.log("SERVER (workspace): Called");
}

export default server
