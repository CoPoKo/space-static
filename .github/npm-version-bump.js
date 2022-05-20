const fs = require('fs/promises')

const pageageFile = {
  "name": "@copoko/space-static",
  "description": "CoPoKo Space Static",
  "version": `1.0.${Date.now()}`,
  "license": "GPL-3.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/CoPoKo/space-static.git"
  },
  "author": "CoPoKo Team",
  "main": "LICENSE"
}

const pageageFileStr = JSON.stringify(pageageFile)
fs.writeFile('./package.json', pageageFileStr, 'utf8', (err) => {
  if (err) throw err
})

