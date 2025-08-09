import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vuetify from "vite-plugin-vuetify";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";

// https://vite.dev/config/
// Auto-imports updated
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: "src/pages",
      dts: true,
    }),
    vue(),
    vueDevTools(),
    vuetify(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        VueRouterAutoImports,
        {
          vuetify: ["useTheme", "useDisplay"],
        },
      ],
      dirs: ["src/utils/"],
      dts: true,
      vueTemplate: true,
    }),
    Components({
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
});
