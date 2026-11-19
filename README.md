# SubSense — Stop Paying for What You Don't Use

> AI-Powered Subscription Management & Recurring Expense Auditor.
> Zero Bank Logins. Zero Credential Risk. 100% Local-First Clarity.

---

## 🚀 Key Features

1. **Privacy-First Statement Ingestion**
   - Ingest statement files via drag & drop in **CSV** or **PDF/text** formats.
   - Files are parsed directly within the browser sandbox.
   - Built-in **Try with Sample Data** preloads a realistic 38-transaction benchmark dataset.

2. **Autonomous Transaction Processing & Cadence Detection**
   - Multi-format column matching (`Date`, `Description`, `Amount`, `Type`, `CR/DR`).
   - Normalization of bank statement noise (e.g., `NETFLIX.COM PAYMENT 402-935-7733 CA` → `Netflix`).
   - Billing cadence analysis (`weekly`, `monthly`, `quarterly`, `annual`).
   - Exclusion of refunds, credits, and ordinary one-time purchases (e.g., groceries, coffee, shopping).

3. **Stealth Price Hike & Duplicate Service Detection**
   - Historical transaction amount comparison flags fee hikes (e.g., Spotify increase from $10.99 to $11.99).
   - Duplicate cluster detection (e.g., Google One + Dropbox overlapping cloud storage).

4. **Service-Specific Cancellation Assistant**
   - Verified official cancellation URLs.
   - Step-by-step self-service guides.
   - Pre-drafted cancellation email templates with 1-click clipboard copy.
   - Fee, notice period, and data retention alerts.

5. **Financial Reports & Exports**
   - Sanitized CSV export with **Formula Injection Protection** (`=`, `+`, `-`, `@` prefix mitigation).
   - Executive PDF generation via `jsPDF`.
   - Real-time potential savings calculation based on flagged subscriptions.

6. **Local-First Persistence**
   - Browser IndexedDB persistence (`SubSenseDB`) stores audits and user decisions (`keep`, `flag-to-cancel`, `review`, `cancelled`).
   - Clear and reset controls anytime.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router with Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS & Lucide React
- **Data Visualization**: Recharts
- **Parsing**: PapaParse & Custom PDF statement extractor
- **PDF Export**: jsPDF
- **Validation**: Zod
- **AI Integration**: Google Gemini API via official `@google/genai` SDK (Server Route Handler with structured JSON output)
- **Database**: IndexedDB (browser-local) & optional Supabase schema preparation

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ or 20+

### Setup Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Quality Assurance

Run the automated test suite:
```bash
npx tsx scripts/testSuite.ts
```

Run ESLint:
```bash
npm run lint
```

Run the production build:
```bash
npm run build
```

---

## ☁️ Cloudflare Pages Deployment

### Option A: Direct Deployment via Cloudflare Dashboard (Recommended)

1. Connect your repository to **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select your repository: `subsense`.
3. Set the build configurations:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages` (or standard Next.js build)
   - **Build output directory**: `.vercel/output/static`
   - **Compatibility date**: `2024-09-23` or later
   - **Compatibility flag**: `nodejs_compat`
4. Add Environment Variables:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `NEXT_PUBLIC_APP_URL`: *(Your production Cloudflare Pages URL)*
5. Click **Save and Deploy**.

### Option B: Deploy from Terminal via Wrangler

If you have a Cloudflare API Token:

```bash
# 1. Provide your Cloudflare API Token in your terminal:
$env:CLOUDFLARE_API_TOKEN="your_cloudflare_api_token"

# 2. Create the Cloudflare Pages project:
npx wrangler pages project create subsense --production-branch main

# 3. Deploy the project:
npm run deploy:pages
```
