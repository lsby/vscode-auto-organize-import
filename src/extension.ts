import * as vscode from 'vscode'

var 插件名称 = 'lsby-vscode-auto-organize-import'

export function activate(_context: vscode.ExtensionContext): void {
  console.log(`${插件名称}: 插件开始运行`)

  var 锁 = false
  vscode.workspace.onDidSaveTextDocument(async () => {
    if (锁) return

    const activeEditor = vscode.window.activeTextEditor

    if (
      activeEditor &&
      (activeEditor.document.languageId === 'typescript' ||
        activeEditor.document.languageId === 'typescriptreact' ||
        activeEditor.document.languageId === 'javascript' ||
        activeEditor.document.languageId === 'javascriptreact')
    ) {
      var 延时时间 = 100
      setTimeout(async () => {
        锁 = true
        await vscode.commands.executeCommand('editor.action.organizeImports')
        锁 = false
        await vscode.commands.executeCommand('workbench.action.files.save')
      }, 延时时间)
    }
  })
}

export function deactivate(): void {}
