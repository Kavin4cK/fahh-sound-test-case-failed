import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {

    const soundPath = path.join(context.extensionPath, 'media', 'fahh.mp3');

    let lastErrorCount = 0;

    vscode.languages.onDidChangeDiagnostics(() => {
        const diagnostics = vscode.languages.getDiagnostics();

        let errorCount = 0;

        diagnostics.forEach(([uri, diags]) => {
            errorCount += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
        });

        if (errorCount > lastErrorCount) {
            playSound(soundPath);
        }

        lastErrorCount = errorCount;
    });
}

function playSound(filePath: string) {
    const player =
        process.platform === 'win32'
            ? `powershell -c (New-Object Media.SoundPlayer '${filePath}').PlaySync();`
            : process.platform === 'darwin'
            ? `afplay "${filePath}"`
            : `aplay "${filePath}"`;

    cp.exec(player);
}

export function deactivate() {}