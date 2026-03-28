import type { Framework } from "@/types";

export function extractCode(text: string): string {
  const match = text.match(/```(?:jsx?|tsx?|vue|html|javascript)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : "";
}

export function buildPreview(code: string, framework: Framework): string {
  if (!code) return "";

  if (framework === "html") return code;

  if (framework === "react") {
    const cleanCode = code.replace(/export\s+default\s+/, "");
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { margin: 0; background: #fff; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext } = React;
    ${cleanCode}
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;
  }

  if (framework === "vue") {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { margin: 0; background: #fff; }</style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${code}
    Vue.createApp(App).mount('#app');
  </script>
</body>
</html>`;
  }

  return "";
}
