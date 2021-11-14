import execa, { Options, ExecaError } from 'execa';

async function execGit(cmd: string[], options: Options = {}) {
  const gitOptions = ['-c', 'submodule.recurse=false']

  try {
    const { stdout } = await execa('git', gitOptions.concat(cmd), {
      ...options,
      all: true,
      cwd: options.cwd || process.cwd(),
    })
    return stdout
  } catch (error) {
    const { all } = (error as ExecaError);

    throw new Error(all)
  }
}

export async function getStagedFiles(options?: Options) {
  try {
    const lines = await execGit(
      ['diff', '--staged', '--diff-filter=ACMR', '--name-only', '-z'],
      options
    )
    return lines ? lines.replace(/\u0000$/, '').split('\u0000') : []
  } catch {
    return [];
  }
}
