import {app, BrowserWindow} from 'electron';
import * as path from 'path';

let win: Electron.BrowserWindow = null;
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
	// Someone tried to run a second instance, we should focus our window.
	if (win) {
		if (win.isMinimized()) {
			win.restore();
		}
		win.focus();
		return false;
	} else {
		return true;
	}
});

if (shouldQuit) {
	app.quit();
} else {
	app.on('ready', () => {
		// win = new BrowserWindow({ width: 800, height: 600, show: false ,autoHideMenuBar: true});
		win = new BrowserWindow();
		win.setMenuBarVisibility(false);
		win.webContents.openDevTools();
		// win.setVisibleOnAllWorkspaces(false);
		win.on('closed', () => {
			win = null;
		});
		win.loadURL('file:///' + path.join(__dirname, '../pages/index.html'));
		// win.show();
	});
}