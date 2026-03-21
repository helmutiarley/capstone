import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["node_modules/**", "frontend/dist/**"],
  },

  // BACKEND (Node)
  {
    files: ["**/*.js"],
    ignores: ["frontend/**"],
    ...js.configs.recommended, // ✅ aqui está o segredo
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },

  // FRONTEND (browser)
  {
    files: ["frontend/**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
