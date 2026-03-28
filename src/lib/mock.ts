import type { Framework } from "@/types";

export const mockResponses: Record<Framework, string> = {
  react: `Here's a simple counter component to get you started.

\`\`\`jsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-6">
        <h1 className="text-white text-xl font-semibold">Counter</h1>
        <span className="text-6xl font-bold text-cyan-400">{count}</span>
        <div className="flex gap-3">
          <button
            onClick={() => setCount(c => c - 1)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-xl"
          >
            −
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors text-sm"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-6 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-xl"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
\`\`\``,

  vue: `Here's a simple toggle component to get you started.

\`\`\`javascript
const { ref } = Vue;

const App = {
  setup() {
    const enabled = ref(false);
    return { enabled };
  },
  template: \`
    <div class="min-h-screen bg-gray-950 flex items-center justify-center">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-6">
        <h1 class="text-white text-xl font-semibold">Toggle</h1>
        <button
          @click="enabled = !enabled"
          class="relative w-16 h-8 rounded-full transition-colors duration-200 focus:outline-none"
          :class="enabled ? 'bg-green-500' : 'bg-gray-700'"
        >
          <span
            class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
            :class="enabled ? 'translate-x-8' : 'translate-x-0'"
          />
        </button>
        <p class="text-sm" :class="enabled ? 'text-green-400' : 'text-gray-500'">
          {{ enabled ? 'Enabled' : 'Disabled' }}
        </p>
      </div>
    </div>
  \`
};
\`\`\``,

  html: `Here's a simple landing hero section to get you started.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Hero</title>
</head>
<body class="bg-gray-950 min-h-screen flex items-center justify-center px-6">
  <div class="text-center max-w-2xl">
    <span class="text-sm text-orange-400 font-medium tracking-widest uppercase">Welcome</span>
    <h1 class="mt-4 text-5xl font-bold text-white leading-tight">
      Build something <span class="text-orange-400">great</span>
    </h1>
    <p class="mt-6 text-gray-400 text-lg leading-relaxed">
      A simple, clean landing page hero. Customize it however you like.
    </p>
    <div class="mt-8 flex gap-4 justify-center">
      <button class="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-400 transition-colors">
        Get started
      </button>
      <button class="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:border-gray-500 transition-colors">
        Learn more
      </button>
    </div>
  </div>
</body>
</html>
\`\`\``,
};
