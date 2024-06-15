import * as path from "path";
import * as fs from "fs";

export const getUIBuildDirectoryPath = () =>
  path.resolve(__dirname, "../ui/dist");

export const getUIBuildFilePaths = () => {
  const uiDist = getUIBuildDirectoryPath();

  let stack = [uiDist];
  let arrayOfFiles = [];

  while (stack.length > 0) {
    let currentPath = stack.pop();
    if (currentPath) {
      let files = fs.readdirSync(currentPath);

      for (const file of files) {
        let fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          stack.push(fullPath);
        } else {
          arrayOfFiles.push(fullPath);
        }
      }
    }
  }

  return arrayOfFiles;
};
