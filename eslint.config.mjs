import globals from "globals";
import js from "@eslint/js";

export default [
  {
    ignores: ["**/dist/*"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
  },
];
