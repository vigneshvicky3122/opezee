import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
export const applications = [] // Array to store application paths

// ... (other code remains the same)

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      nodeIntegration: true,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true
    }
  })
  mainWindow.webContents.openDevTools()
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  dialog
    .showOpenDialog({
      title: 'Select Application File',
      properties: ['openFile'],
      filters: [{ name: 'Executable Files', extensions: ['exe'] }]
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const selectedFilePath = result.filePaths[0]
        // Do something with the selected file path (e.g., add it to the applications list)
        console.log(selectedFilePath)
      }
    })
    .catch((err) => {
      console.error(err)
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-file-dialog', async (event, arg) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Executable Files', extensions: ['exe'] }],
    defaultPath: path.join(app.getPath('documents'))
  })
  return result
})
ipcMain.on('add-application', (event, filePath) => {
  if (!applications.includes(filePath)) {
    applications.push(filePath)
    // Save applications to storage or perform necessary operations
    // For instance, you can use `electron-store` or other storage mechanisms
  }
})
ipcMain.on('remove-application', (event, filePath) => {
  const index = applications.indexOf(filePath)
  if (index !== -1) {
    applications.splice(index, 1)
    // Update storage or perform necessary operations for removal
  }
})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
