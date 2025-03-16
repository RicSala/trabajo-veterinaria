import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // webpack: (config, { dev, isServer }) => {
  //   if (dev) {
  //     // 1. MODIFY IGNORED PATTERN
  //     // This is the key part: we're telling webpack which files to watch or ignore
  //     config.watchOptions = {
  //       ...config.watchOptions,
  //       ignored: [
  //         // Ignore all node_modules...
  //         path.resolve('node_modules'),
  //         // ...EXCEPT our specific libraries
  //         '!' + path.resolve('node_modules/@daveyplate/better-auth-ui'),
  //         '!' + path.resolve('node_modules/@daveyplate/better-auth-tanstack'),
  //       ],
  //       // Follow symbolic links if we're using them
  //       followSymlinks: true,
  //     };

  //     return config;
  //   }
  // },
  // 5. TRANSPILE PACKAGES
  // This tells Next.js to include our library in its transpilation process
  // transpilePackages: [
  //   '@daveyplate/better-auth-ui',
  //   '@daveyplate/better-auth-tanstack',
  // ],
};

export default nextConfig;

// 2. ADD MODULE RESOLUTION
// This helps webpack find our library's files
// config.resolve.modules = [
//   ...(config.resolve.modules || []),
//   path.resolve('node_modules/@daveyplate/better-auth-ui'),
// ];

// // 3. CONFIGURE LOADERS
// // This tells webpack how to process our library's files
// config.module.rules.push({
//   // Process JavaScript and TypeScript files
//   test: /\.(js|jsx|ts|tsx)$/,
//   // Only process files from our library
//   include: [path.resolve('node_modules/@daveyplate/better-auth-ui')],
//   use: [
//     {
//       // Use babel-loader to transpile the files
//       loader: 'babel-loader',
//       options: {
//         // Use the same babel presets as Next.js
//         presets: ['next/babel'],
//         // Enable Hot Module Replacement for React components
//         plugins: ['react-refresh/babel'],
//       },
//     },
//   ],
// });

// 4. ADD DEBUGGING PLUGINS
// This helps us understand what webpack is doing
// config.plugins.push({
//   apply: (compiler) => {
//     // Log when files change
//     compiler.hooks.watchRun.tap('WatchRunPlugin', (comp) => {
//       if (comp.modifiedFiles) {
//         const modifiedPaths = Array.from(comp.modifiedFiles);
//         const libraryChanges = modifiedPaths.filter(path =>
//           path.includes('@daveyplate/better-auth-ui')
//         );

//         if (libraryChanges.length > 0) {
//           console.log('Library files changed:', libraryChanges);
//         }
//       }
//     });

//     // Log when compilation starts
//     compiler.hooks.compile.tap('CompilePlugin', () => {
//       console.log('Webpack compilation started');
//     });

//     // Log when compilation completes
//     compiler.hooks.done.tap('DonePlugin', (stats) => {
//       console.log('Webpack compilation completed');
//       if (stats.hasErrors()) {
//         console.error('Compilation errors:', stats.toString({
//           chunks: false,
//           colors: true,
//         }));
//       }
//     });
//   }
// });
