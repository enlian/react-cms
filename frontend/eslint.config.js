import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { Linter } from 'eslint';

// 导入 typescript-eslint 插件和解析器
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const config = {
  ignores: ['dist'],
  // 配置继承规则
  extends: [
    js.configs.recommended,
    'plugin:@typescript-eslint/recommended', // typescript-eslint 推荐配置
  ],
  files: ['**/*.{ts,tsx}'], // 匹配 ts 和 tsx 文件
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parser: tsParser, // 使用 typescript-eslint 解析器
  },
  plugins: {
    'react-hooks': reactHooks,
    '@typescript-eslint': tsPlugin, // 注册 typescript-eslint 插件
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^React$', argsIgnorePattern: '^_' }, // 忽略 React 和未使用的参数
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭明确类型边界的警告
  },
};

export default config;
