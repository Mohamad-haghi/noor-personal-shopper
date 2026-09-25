# Replit project notes

## Run and build

- Start the development preview with `npm run dev`.
- The Vite server binds to `0.0.0.0:5000` and allows Replit's proxied host.
- Verify the production bundle with `npm run build`.
- The mode defaults to `demo`; `.env.example` documents the optional
  `VITE_NOOR_MODE` setting.

## Architecture constraints

- Keep UI → feature/domain → service → provider interface → provider boundaries.
- Add persistence only behind service/provider boundaries, never directly from UI.
- The demo provider must not call real NOOR services. Integrated mode is reserved
  but not implemented.
- Preserve Persian-first document language and RTL direction (`fa` / `rtl`).
- Do not add product, shopping, account, or production integration behavior in
  the foundation phase.