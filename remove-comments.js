const fs = require('fs');
const path = require('path');

function removeTSComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]\/\/).*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\n/gm, '')
    .trim();
}

function removeHTMLComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  if (ext === '.ts' || ext === '.js') {
    content = removeTSComments(content);
  } else if (ext === '.html') {
    content = removeHTMLComments(content);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  } else {
    console.log(`No changes: ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && /\.(ts|js|html)$/i.test(file)) {
      processFile(fullPath);
    }
  });
}

const srcDir = path.join(__dirname, 'src');
console.log('Starting to remove comments from files in:', srcDir);
processDirectory(srcDir);
console.log('Finished processing all files.');
