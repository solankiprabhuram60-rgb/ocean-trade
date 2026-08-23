# OceanTrade AI

Adds three marketplace AI features:

- AI Assistant: floating chat widget that understands natural-language requests.
- AI Search: turns a natural-language request into a marketplace search and shows matching assets.
- AI Product Recommendations: uses the current OceanTrade catalog to select up to six relevant products.

## Setup

1. Add an OpenAI API key to the existing `.env` file:

   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-5.6-luna

2. Restart the dev server:

   npm run dev

The browser never receives the API key; the key is read only by `src/app/api/ai/route.ts` on the server.

Without an API key, the widget still works with local keyword-based recommendations using the catalog/demo products, so the UI can be tested before API billing is configured.
