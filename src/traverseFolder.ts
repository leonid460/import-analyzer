import { join as pathJoin } from 'path';
import { readdir } from 'fs/promises';

export async function traverseDir(dirPath: string, onFileCallback: (filePath: string) => void) {
  try {
    const dirItems = await readdir(dirPath, { withFileTypes: true });
    const promises: Array<Promise<void>> = [];

    for (const dirItem of dirItems) {
      if (dirItem.isDirectory()) {
        promises.push(traverseDir(pathJoin(dirPath, dirItem.name), onFileCallback))
      }

      if (dirItem.isFile()) {
        onFileCallback(pathJoin(dirPath, dirItem.name));
      }
    }

    await Promise.all(promises);

  } catch (err) {
    console.error(err);
  }
}
