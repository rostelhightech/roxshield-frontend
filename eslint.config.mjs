import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// En CI (build de prod, pipeline), on est strict : warnings → erreurs.
// En local, on reste permissif pour ne pas bloquer le dev au quotidien.
const isCI = process.env.CI === "true" || process.env.NODE_ENV === "production";
const severity = (prodLevel) => (isCI ? prodLevel : "warn");

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    ignores: ["public/**", "node_modules/**", "dist/**", "build/**"],
  },

  {
    rules: {

      "react-hooks/set-state-in-effect": "off",
      // ──────────────────────────────────────────────
      // Exceptions projet (justifiées, à garder)
      // ──────────────────────────────────────────────
      // Allow `as any` — used extensively for i18n translation keys and Prisma
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",

      // ──────────────────────────────────────────────
      // Code mort / qualité — strict en CI
      // ──────────────────────────────────────────────
      "@typescript-eslint/no-unused-vars": [
        severity("error"),
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-unused-vars": "off", // délégué à la règle TS ci-dessus
      "prefer-const": severity("error"),
      "no-var": "error", // jamais de var, même en dev
      eqeqeq: ["error", "always", { null: "ignore" }],

      // ──────────────────────────────────────────────
      // Debug / logs — bloquant en CI, ok en dev
      // ──────────────────────────────────────────────
      "no-console": [
        severity("error"),
        { allow: ["warn", "error"] }, // console.log interdit en prod, warn/error tolérés
      ],
      "no-debugger": "error", // jamais un debugger qui passe en prod
      "no-alert": severity("error"),

      // ──────────────────────────────────────────────
      // React / Hooks — bugs runtime fréquents
      // ──────────────────────────────────────────────
      "react-hooks/exhaustive-deps": severity("error"),
      "react-hooks/rules-of-hooks": "error", // toujours bloquant, casse l'app sinon
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",
      "react/self-closing-comp": severity("warn"),

      // ──────────────────────────────────────────────
      // TypeScript — fiabilité du typage
      // ──────────────────────────────────────────────
      "@typescript-eslint/no-non-null-assertion": "warn", // le `!` masque des bugs potentiels
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        { "ts-ignore": "allow-with-description" },
      ],

      // ──────────────────────────────────────────────
      // Promesses non gérées — source classique de bugs silencieux
      // (nécessite parserOptions.project type-aware — voir note plus bas)
      // ──────────────────────────────────────────────
      // "@typescript-eslint/no-floating-promises": severity("error"),

      // ──────────────────────────────────────────────
      // Sécurité basique
      // ──────────────────────────────────────────────
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated code — do not lint
    "src/generated/**",
    // Test artifacts
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;