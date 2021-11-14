import { getStagedFiles } from './getStagedFiles';

function getInputArgs() {
  const args = process.argv.slice(2);

  if (args[0] === '--staged-check') {
    return {
      stagedCheck: true,
      entries: [],
      libName: args[1],
    }
  }

  return {
    stagedCheck: false,
    entries: args.splice(0, args.length-1),
    libName: args[args.length-1]
  }
}

export async function getEntriesAndLibName() {
  const { entries, libName, stagedCheck } = getInputArgs();

  if (stagedCheck) {
    const stagedFiles = await getStagedFiles();

    return { entries: stagedFiles, libName, stagedCheck };
  }

  return { entries, libName, stagedCheck };
}
