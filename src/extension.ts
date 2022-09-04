// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "kaizer" is now active!');

	// The WebviewPanel we will use to display our Pet(s)
	let panel: vscode.WebviewPanel | undefined = undefined;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('kaizer.initializePet', () => {


		const currentWindow = vscode.window.activeTextEditor?.viewColumn;


		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Pengu says Hello!');
		if (panel) {
			panel.reveal(currentWindow);
		} else {
			panel = vscode.window.createWebviewPanel(
				'kaizer',
				'Kaizer Pets',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
				}
			);

			panel.webview.html = getWebviewContent(panel.webview);

			panel.onDidDispose(
				() => {
					panel = undefined;
				},
				null,
				context.subscriptions
			);
		}

	});

	vscode.commands.registerCommand('kaizer.feedPet', () => {
		vscode.window.showInformationMessage("");
	});

	function getWebviewContent(webview: vscode.Webview) {
		const nonce = getNonce();
		const rivePath = webview.asWebviewUri(
			vscode.Uri.joinPath(
				context.extensionUri, 'media', 'kaizer.riv'
			)
		);
		return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="https://unpkg.com/@rive-app/canvas-single@1.0.79"></script>
		<title>Kaizer</title>
	</head>
	<body>
		<canvas id="canvas" width="500" height="500"></canvas>
		<script nonce="${nonce}">
			new rive.Rive({
				// src: "https://rive.app/s/8q5bpiZnzEmOqGwimfZy2A/",
				// Or the path to a local Rive asset
				src: '${rivePath}',
				canvas: document.getElementById("canvas"),
				animations: ['Idle', 'Wave'],
				autoplay: true
			});
		</script>
	</body>
</html`;
	}

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

// Generate a Nonce that can be used with our scripts
function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}