import js from "@eslint/js";

import pluginVue from 'eslint-plugin-vue'
import {
    defineConfig,
    createConfig as vueTsEslintConfig,
} from '@vue/eslint-config-typescript'

import skipFormattingConfig from "@vue/eslint-config-prettier/skip-formatting";


export default
    defineConfig(
        js.configs.recommended,
        pluginVue.configs['flat/essential'],
        vueTsEslintConfig(),
        skipFormattingConfig,
        {
            languageOptions: {
                parserOptions: {
                    ecmaVersion: 'latest'
                }
            }
        },
        {
            files: [
                "**/*.vue",
                "**/*.js",
                "**/*.jsx",
                "**/*.cjs",
                "**/*.mjs",
                "**/*.ts",
                "**/*.tsx",
                "**/*.cts",
                "**/*.mts",
            ]
        },
        {
            ignores: [".gitginore", "dist/"]
        }
    )