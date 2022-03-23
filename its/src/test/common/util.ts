/* --------------------------------------------------------------------------------------------
 * SonarLint for VisualStudio Code
 * Copyright (C) 2017-2022 SonarSource SA
 * sonarlint@sonarsource.com
 * Licensed under the LGPLv3 License. See LICENSE.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';

const MAX_WAIT_DIAGNOSTICS_MS = 20000;

export async function waitForSonarLintDiagnostics(
  fileUri: vscode.Uri,
  minimumExpectedIssueCount = 1,
  timeoutMillis = MAX_WAIT_DIAGNOSTICS_MS
) {
  const startTime = new Date();
  let diags = getSonarLintDiagnostics(fileUri);
  while (diags.length < minimumExpectedIssueCount && new Date().getTime() - startTime.getTime() < timeoutMillis) {
    await sleep(200);
    diags = getSonarLintDiagnostics(fileUri);
  }
  return diags;
}

export function dumpLogOutput() {
  vscode.workspace.textDocuments.forEach(t => {
    if (t.languageId === 'Log') {
      console.log(t.fileName);
      console.log(t.getText());
    }
  });
}

function getSonarLintDiagnostics(fileUri: vscode.Uri) {
  return vscode.languages.getDiagnostics(fileUri).filter(d => d.source === 'sonarlint');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
