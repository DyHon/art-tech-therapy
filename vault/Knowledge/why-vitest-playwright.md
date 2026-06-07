# Why Vitest (unit) + Playwright (E2E)
- Source(s): converted (VI→EN) from `docs/why using_/Tại sao sử dụng Vitest for unit tests_ Playwright for E2E tests.docx` (Google Doc export).

## Summary
From a Web Developer's perspective, combining Vitest and Playwright is today's "Modern Dream Stack" for testing, fully replacing the older Jest and Cypress pairing. Vitest leverages Vite and esbuild to run pure-logic unit tests (Shadow Guard, vector calculation, Jungian symbol extraction) blazingly fast, while Playwright drives real browser engines for E2E coverage. Together they keep the sensitive backend analysis logic and the "dreamy" frontend UI reliable across every device.

From a Web Developer's technical perspective, the current combination of Vitest and Playwright is considered a "Modern Dream Stack" for testing. It completely replaces the older-generation duo of Jest and Cypress.

When building a sensitive system like Art-Tech Therapy, where both the psychological analysis logic (Backend) and the hazy, dreamy interface experience (Frontend "dreamy" UI) are extremely complex, this pair solves the following key problems:

## 1. Why Vitest for Unit Testing?
Previously, Jest was king. But as the ecosystem shifted toward Vite (the ultra-fast build tool that Next.js and modern frameworks all support or are well-compatible with at the compiler layer), Jest became cumbersome because it needs complex transformers (pre-processors) to understand TypeScript or ESM.
- Blazing Fast execution: Vitest takes full advantage of the power of Vite and esbuild. It runs logic tests using parallel worker threads, reducing Unit Test run time from several minutes (with Jest) down to a few seconds. When you use Antigravity to automatically fix code and re-run tests (Watch Mode), Vitest responds instantly, with no delay.
- Shared Configuration: Vitest shares its configuration file with Vite. You no longer have to suffer the headache of configuring and re-configuring the jest.config file and worrying about TypeScript compile errors or importing css/svg in the test environment.
- Optimized for Jungian logic functions: In our system, the symbol-extraction functions, the vector-distance calculation function (pgvector logic), and the Shadow Guard safety filter are pure logic (Pure Functions). Vitest is the most perfect tool to isolate and test these functions with the highest performance.

## 2. Why Playwright for End-to-End (E2E) Testing?
E2E testing is about simulating a bot that opens a browser, clicks into the app, and types a journal like a real user in order to test the entire flow from Frontend down to Backend. Previously Cypress was very popular, but Playwright (developed by Microsoft) has overthrown the throne for the following reasons:
- True Multi-browser support: Cypress actually runs inside a simulated browser using an iframe. Playwright, on the other hand, directly controls real browser engines (Chromium, WebKit/Safari, and Firefox) through a low-level protocol (CDP). This is extremely important because the "dreamy UI" uses many Framer Motion animation effects that must display smoothly and not break on both iPhone (Safari) and Android/PC (Chrome).
- Smart Auto-waiting: One of the biggest pains when running E2E tests for AI-powered applications is asynchronous latency. When the user clicks "Analyze dream," the system has to call Whisper -> call Gemini -> compute vectors, which takes a few seconds. Playwright has a mechanism that automatically waits until the element appears on screen or the API returns a result before continuing the test, completely eliminating "unfairly broken" (flaky) tests caused by a slow network.
- Perfect Test Isolation architecture: Playwright uses the concept of BrowserContext, creating a completely clean environment (like an incognito tab) for each test case. You can test the user journaling flow, then test the psychology-professional login flow, without fear of inheriting each other's old cookies or sessions.

### In summary, from the Architecture perspective:
- We choose Vitest so that Antigravity can run hundreds of internal logic tests (Shadow Guard, Vector calculation) in the blink of an eye.
- We choose Playwright to ensure that the artistic interface (Art UI) and the user's journey from entering a dream to displaying the Dashboard (The Constellation) run perfectly on every device.

## Related notes
- [[architecture-vision]]
