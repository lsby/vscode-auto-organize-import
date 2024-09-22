import * as vscode from 'vscode'

var 插件名称 = 'lsby-vscode-auto-organize-import'

export function activate(_context: vscode.ExtensionContext): void {
  console.log(`${插件名称}: 插件开始运行`)

  var 锁 = false
  vscode.workspace.onDidSaveTextDocument(async () => {
    if (锁) return

    const 最大尝试次数 = 10
    const 检查间隔 = 100
    const 最大等待时间 = 1000

    const activeEditor = vscode.window.activeTextEditor

    if (
      activeEditor &&
      (activeEditor.document.languageId === 'typescript' ||
        activeEditor.document.languageId === 'typescriptreact' ||
        activeEditor.document.languageId === 'javascript' ||
        activeEditor.document.languageId === 'javascriptreact')
    ) {
      await vscode.commands.executeCommand('editor.action.organizeImports')

      let 尝试次数 = 0
      const 保存 = setInterval(() => {
        const document = activeEditor.document

        // 如果文档是脏的，立即保存并停止循环
        if (document.isDirty) {
          锁 = true
          void vscode.commands.executeCommand('workbench.action.files.save').then(() => {
            锁 = false
          })
          clearInterval(保存)
          return
        }

        // 如果已达到最大尝试次数，停止循环
        尝试次数++
        if (尝试次数 >= 最大尝试次数) {
          clearInterval(保存)
        }
      }, 检查间隔)

      // 为了避免意外的无限循环, 加一个定时器兜底
      setTimeout(() => {
        clearInterval(保存)
      }, 最大等待时间)
    }
  })
}

export function deactivate(): void {}
