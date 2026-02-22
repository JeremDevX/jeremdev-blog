import globals from "globals";
import tseslint from "typescript-eslint";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const nextBaseConfig = nextCoreWebVitals.find((config) => config.name === "next");
const nextCoreWebVitalsConfig = nextCoreWebVitals.find(
  (config) => config.name === "next/core-web-vitals",
);
const nextIgnoreConfig = nextCoreWebVitals.find((config) => "ignores" in config);
const nextPlugin = nextBaseConfig?.plugins?.["@next/next"];

function pickNextPluginRules(rules = {}) {
  return Object.fromEntries(
    Object.entries(rules).filter(([ruleName]) => ruleName.startsWith("@next/next/")),
  );
}

export default [
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    ignores: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "src/__tests__/**"],
    ...(nextPlugin ? { plugins: { "@next/next": nextPlugin } } : {}),
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...pickNextPluginRules(nextBaseConfig?.rules),
      ...pickNextPluginRules(nextCoreWebVitalsConfig?.rules),
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: [
      ...(nextIgnoreConfig?.ignores ?? []),
      "coverage/**",
    ],
  },
];
