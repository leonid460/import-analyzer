import { resolve as pathResolve } from 'path';
import { findPackageImportsInLocation } from './findPackageImportsInLocation';
import { getEntriesAndLibName } from './getEntriesAndLibName';
import { getOutputStringWithStats } from './outputStatsToCLI';
import { TModuleUsagesInFile } from './types';

void async function main() {
  const { entries, libName, stagedCheck } = await getEntriesAndLibName();
  const promises: Array<Promise<TModuleUsagesInFile[]>> = [];

  entries.forEach(location => {
    promises.push(findPackageImportsInLocation(pathResolve(location), libName));
  });

  const result = await Promise.all(promises);

  if (stagedCheck && result.every(filesStats => !filesStats.length)) {
    return;
  }

  const outputStatsString = getOutputStringWithStats({
    entries,
    entriesStats: result,
    libName
  });

  console.log(outputStatsString);

  if (stagedCheck) {
    process.exitCode = 1;
  }
}();
