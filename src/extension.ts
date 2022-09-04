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
	
	context.subscriptions.push(
		vscode.commands.registerCommand('kaizer.initializePet', () => {
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
		})
	);


	context.subscriptions.push(
		vscode.commands.registerCommand('kaizer.feedPet', () => {
			vscode.window.showInformationMessage("Pengu thanks you for the yummy fish");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('kaizer.specialMove', () => {
			if (panel) {
				panel.webview.postMessage({ command: 'specialMove'});
			}
		})
	);

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
			// The 'Wave' trigger in our Rive state machine
			let wave;

			const pengu = new rive.Rive({
				// src: "https://rive.app/s/8q5bpiZnzEmOqGwimfZy2A/",
				// Or the path to a local Rive asset
				src: '${rivePath}',
				canvas: document.getElementById("canvas"),
				animations: ['Wave', 'Idle'],
				stateMachines: ['State Machine 1'],
				autoplay: true,
				onLoad: (_) => {
					wave = pengu.stateMachineInputs('State Machine 1')
						.find(i => i.name === 'Wave');
				},
			});

			window.addEventListener('message', event => {
				const message = event.data;
	
				switch (message.command) {
					case 'specialMove':
						if (wave) {
							wave.fire();
						}
						break;
				}
			});
		</script>
	</body>
</html`;
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}

// Generate a Nonce that can be used with our scripts
// TODO: set up a Content Policy header for production
function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}