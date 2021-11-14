import { checkPackageImportInFile } from './checkPackageImportInFile';
import { recognizeDirectory } from './recognizeDirectory';
import { traverseDir } from './traverseFolder';
import { TModuleUsagesInFile } from './types';

export async function findPackageImportsInLocation(locationPath: string, libName: string) {
  const promises: Array<Promise<TModuleUsagesInFile>> = [];
  const isDirectory = await recognizeDirectory(locationPath);

  if (isDirectory) {
    await traverseDir(locationPath, (filePath) => {
      promises.push(checkPackageImportInFile(filePath, libName));
    });
  } else {
    promises.push(checkPackageImportInFile(locationPath, libName));
  }

  const filesStatsList = await Promise.all(promises);

  return filesStatsList.filter(usagesInFile => usagesInFile.usages.length);
}
