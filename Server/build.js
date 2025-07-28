import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/ts/script.ts'],
  bundle: true,
  outfile: 'build/js/bundle.js',
  minify: false,
  sourcemap: true,
  platform: 'browser',
}).catch(() => process.exit(1));