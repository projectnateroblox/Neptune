import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { callFunction } from "./server";
import { callFunctionProxy } from "./cors-proxy";
import { spawn, ChildProcess } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let serverProcess: ChildProcess | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 900,
    height: 690,
    autoHideMenuBar: true,
    frame: false,
    roundedCorners: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  ipcMain.on("ping", () => console.log("pong"));
  ipcMain.on("close-window", () => {
    app.quit();
  });
  ipcMain.on("minimize-window", () => {
    win?.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (win?.isMaximized()) {
      win?.unmaximize();
    } else {
      win?.maximize();
    }
  });
}

// function startServer() {
//   const serverPath = join(__dirname, 'server.ts')

//   serverProcess = spawn('node', [serverPath], {
//     stdio: 'inherit',
//     shell: true
//   })

//   serverProcess.on('error', (err) => {
//     console.error('Server process error:', err)
//   })

//   serverProcess.on('exit', (code) => {
//     console.log(`Server exited with code ${code}`)
//   })
// }

function startServer() {
  const serverPath = path.join(".", "publish", "ConsoleApp1.exe");

  serverProcess = spawn(serverPath, []);

  if (serverProcess.stdout) {
    serverProcess.stdout.on("data", (data: Buffer) => {
      console.log(`SERVER (api): \n${data}`);
    });
  }

  if (serverProcess.stderr) {
    serverProcess.stderr.on("data", (data: Buffer) => {
      console.error(`SERVER ERROR (api): ${data}`);
    });
  }

  serverProcess.on("close", (code: number | null) => {
    console.log(`Server (api) exited with code ${code}`);
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  fetch("http://localhost:2025/stop/", {
    method: "post",
  }).catch((error) => {
    console.log("Failed to send stop request:", error.message);
  });

  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  startServer();
  callFunction(); // call function from server.ts to start the works
  callFunctionProxy();
});
