import chalk from 'chalk';
import { TModuleUsagesInFile } from './types';

type TOutputStatsToCLIArgs = {
  entriesStats: TModuleUsagesInFile[][];
  entries: string[];
  libName: string;
}

export function getOutputStringWithStats({ entries, entriesStats, libName }: TOutputStatsToCLIArgs) {
  const counters = new Array(entries.length).fill(0);
  const filesCounters = [...counters];
  let outputString = '\n';

  outputString += chalk.bgBlue.black(` "${chalk.bold(libName)}" module \n`);

  entriesStats.forEach((entryStats, entryIndex) => {
    if (!entryStats.length) {
      return;
    }

    outputString += chalk.blue.bold(`[ROOT] ${entries[entryIndex]}\n`);

    entryStats.forEach(filesStats => {
      filesCounters[entryIndex]++;
      outputString += chalk.green.bold(`  [FILE] ${filesStats.filePath}\n`);

      filesStats.usages.forEach(usage => {
        counters[entryIndex]++;
        outputString += `    ${chalk.grey(usage.index)} | ${chalk.whiteBright(usage.line)}\n`;
      })
    });
  });

  outputString += '\n';

  if (entries.length > 1) {
    counters.forEach((counter, index) => {
      const filesCounter = filesCounters[index];

      outputString += `${chalk.bold(entries[index])}: ${counter} matches in ${filesCounter} files\n`;
    });
  }

  const totalMatchesCounter = counters.reduce((acc, value) => acc + value);
  const totalFilesCounter = filesCounters.reduce((acc, value) => acc + value);

  outputString += `${chalk.bold('total')}: ${totalMatchesCounter} matches in ${totalFilesCounter} files\n`;

  return outputString;
}
