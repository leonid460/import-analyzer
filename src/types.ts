export type TModuleUsagesInFile = {
  filePath: string;
  usages: TModuleUsageStatEntry[];
}

export type TModuleUsageStatEntry = {
  index: number;
  line: string;
}
