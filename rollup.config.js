// import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild' 
import dts from 'rollup-plugin-dts'

const input = 'src/export.ts'

const external = [ 
  'vue',
]

function createConfig(format, output, plugins = [], minify = false) {
  const tsPlugin = esbuild({
    sourceMap: true,
    minify,
    target: 'es2019',
  })

  return {
    input,
    external,
    output: {
      format,
      ...output,
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      tsPlugin,
    ],
  }
}

export default [
  createConfig('es', { file: 'build/yang.module.js' }),
  createConfig('es', { file: 'build/yang.module.min.js' }, [], true),
  createConfig('cjs', { file: 'build/yang.js' }),
  {
    input: 'types/export.d.ts',
    external,
    plugins: [dts()],
    output: {
      format: 'es',
      file: 'build/yang.d.ts',
    },
  },
]
