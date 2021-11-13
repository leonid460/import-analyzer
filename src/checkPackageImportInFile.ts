import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

type TModuleUsageStatEntry = {
  index: number;
  line: string;
}

export function checkPackageImportInFile(filePath: string, libraryName: string): Promise<TModuleUsageStatEntry[]> {
  const stream = fs.createReadStream(path.resolve(__dirname, filePath), { encoding: 'utf-8' });
  const lineReader = readline.createInterface({ input: stream });
  const statsCollection: TModuleUsageStatEntry[] = [];
  let linesCounter = 0;
  let isInMultilineImport = false;

  const processSingleLineImport = (matches: RegExpMatchArray) => {
    const sourceName = matches[2].slice(1, -1);

    if (sourceName.includes(libraryName)) {
      statsCollection.push({ index: linesCounter, line: matches[0] });
    }
  }

  const processMultilineImport = (matches: RegExpMatchArray) => {
    const sourceName = matches[1].slice(1, -1);

    if (sourceName.includes(libraryName)) {
      statsCollection.push({ index: linesCounter, line: matches[0] });
    }
  }

  lineReader.on('line', line => {
    const singleLineImportMatch = matchForSingleLineImport(line);
    const multiLineImportBeginningMatch = matchForMultilineImportBeginning(line);
    const multiLineImportEndingMatch = matchForMultilineImportEnding(line);

    if (singleLineImportMatch) {
      processSingleLineImport(singleLineImportMatch);
    } else if (multiLineImportBeginningMatch && !isInMultilineImport) {
      isInMultilineImport = true;
    } else if (multiLineImportEndingMatch && isInMultilineImport) {
      isInMultilineImport = false;

      return processMultilineImport(multiLineImportEndingMatch);
    }

    linesCounter++;
  });

  return new Promise(resolve => {
    lineReader.on('close', () => {
      resolve(statsCollection);
    });
  });
}

function matchForSingleLineImport(line: string) {
  const regExp = /import\s(\w*|{[\s\w,]*}|\w*,\s{[\s\w,]*})\sfrom\s('.*'|".*")/;

  return line.match(regExp);
}

function matchForMultilineImportBeginning(line: string) {
  const regExp = /import\s({\n|\w*,\s{\n)/;

  return line.match(regExp);
}

function matchForMultilineImportEnding(line: string) {
  const regExp = /}\sfrom\s(".*"|'.*')/;

  return line.match(regExp);
}
