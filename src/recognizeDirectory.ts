import { stat } from 'fs';

export async function recognizeDirectory(locationPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    stat(locationPath, (error, stats) => {
      if (error) {
        return reject(error);
      }

      return resolve(stats.isDirectory());
    })
  });
}
