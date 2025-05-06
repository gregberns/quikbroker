#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// First, clean up any existing build artifacts
console.log('Cleaning up previous builds...');
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
}

// Now, run a simple build that only copies the source files to dist
console.log('Copying source files to dist...');

// Create dist directory
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

// Copy the src directory structure to dist
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Copy all files from src to dist
copyDir(path.join(__dirname, 'src'), path.join(__dirname, 'dist'));

// Create a package.json mapping that enables direct imports
console.log('Creating package.json for direct imports...');

// Write the main package.json file
fs.writeFileSync(
  path.join(__dirname, 'package.json'),
  JSON.stringify({
    name: "@quikbroker/ui-components",
    version: "0.1.0",
    private: true,
    main: "./dist/index.ts",
    module: "./dist/index.ts",
    types: "./dist/index.ts",
    sideEffects: false,
    files: [
      "dist/**"
    ],
    dependencies: {
      "@radix-ui/react-avatar": "^1.1.7",
      "@radix-ui/react-dialog": "^1.1.11",
      "@radix-ui/react-dropdown-menu": "^2.1.12",
      "@radix-ui/react-label": "^2.1.4",
      "@radix-ui/react-progress": "^1.1.4",
      "@radix-ui/react-select": "^2.2.2",
      "@radix-ui/react-separator": "^1.1.4",
      "@radix-ui/react-slot": "^1.2.0",
      "@radix-ui/react-tabs": "^1.1.9",
      "@radix-ui/react-tooltip": "^1.2.4",
      "class-variance-authority": "^0.7.1",
      "clsx": "^2.1.1",
      "lucide-react": "^0.503.0",
      "next-themes": "^0.4.6",
      "tailwind-merge": "^3.2.0"
    },
    peerDependencies: {
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
      "tailwindcss": "^4.1.3"
    }
  }, null, 2)
);

console.log('Build completed successfully!');