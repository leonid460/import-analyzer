import { resolve as pathResolve, join as pathJoin } from 'path';
import { readdir } from 'fs/promises';

export async function traverseDir(dirPath: string, onFileCallback?: (filePath: string) => void) {
  try {
    const dirItems = await readdir(dirPath, { withFileTypes: true });

    for (const dirItem of dirItems) {
      if (dirItem.isDirectory()) {
        traverseDir(pathJoin(dirPath, dirItem.name))
      }

      if (dirItem.isFile()) {
        console.log(`[FILE] ${dirPath}/${dirItem.name}`)
      }
    }
  } catch (err) {
    console.error(err);
  }
}

traverseDir(pathResolve(__dirname))
