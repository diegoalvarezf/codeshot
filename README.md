# codeshot

AI code generator with live preview. Describe what you want to build and get working code instantly — React, Vue, or HTML/CSS/JS.

**[codeshot-sooty.vercel.app](https://codeshot-sooty.vercel.app)**

## Features

- Generate React, Vue 3, and HTML/CSS/JS components from a prompt
- Live preview rendered in an iframe
- Streaming output — see the code as it generates
- Conversation context — iterate on your component with follow-up prompts
- Copy generated code in one click

## Stack

- **Next.js 16** + TypeScript
- **Claude Sonnet 4.6** via Anthropic API
- **Tailwind CSS v4**
- React preview via Babel standalone CDN
- Vue 3 preview via Vue global CDN

## Running locally

```bash
git clone https://github.com/diegoalvarezf/codeshot.git
cd codeshot
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-...
ACCESS_CODE=your_access_code   # optional — remove to leave open
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

Deploy to Vercel with one click. Set `ANTHROPIC_API_KEY` and optionally `ACCESS_CODE` as environment variables.

The app includes:
- **Mock mode** — works without an API key, returns example components
- **Rate limiting** — 10 requests per IP per hour
- **Access code gate** — optional lock screen to control who can use it

## License

MIT
