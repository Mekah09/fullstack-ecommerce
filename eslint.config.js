import js from "@eslint/js";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended, reactRefresh.configs.vite],
    rules: {
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true, extraHOCs: ["withShop"] },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportSpecifier[imported.name=/^use[A-Z]/]",
          message:
            "Use class state, lifecycle methods, or Context.Consumer instead of hooks.",
        },
        {
          selector:
            "CallExpression[callee.type=Identifier][callee.name=/^use[A-Z]/]",
          message: "Hooks are not used in this project.",
        },
        {
          selector:
            "CallExpression[callee.type=MemberExpression][callee.property.name=/^use[A-Z]/]",
          message: "Hooks are not used in this project.",
        },
      ],
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
]);
