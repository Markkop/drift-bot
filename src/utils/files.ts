import fs from 'fs'
import { dump } from 'js-yaml'

export function openFile(path: string) {
  try {
    const file = fs.readFileSync(path)
    return JSON.parse(String(file))
  } catch (err) {
    console.error(err)
  }
}

function createFoldersIfInexistent(filePath: string) {
  const folders = filePath.split('/').slice(0, -1);
  folders.reduce((acc, folder) => {
    const folderPath = acc + folder + '/';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    return folderPath
  }, '');
}

export function saveFile(data: any, filePath: string) {
  try {
    createFoldersIfInexistent(filePath)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  }
}

export function saveJsonAsYamlFile(data: any, filePath: string) {
  try {
    createFoldersIfInexistent(filePath)
    fs.writeFileSync(filePath, dump(data, {
      lineWidth: -1,
      noArrayIndent: true
    }))
  } catch (err) {
    console.error(err)
  }
}