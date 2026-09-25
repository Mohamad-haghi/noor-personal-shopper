# NOOR Personal Shopper Demo

Persian-first, right-to-left foundation for an independent NOOR Personal Shopper
demo. The current foundation displays runtime status only; it does not connect
to real NOOR systems or implement shopping features.

## Run

```sh
npm install
npm run dev
```

The development server listens on port 5000. Build with `npm run build`.

## Configuration

Copy `.env.example` to `.env` if you need to set the mode explicitly.
`VITE_NOOR_MODE` defaults to `demo`. `integrated` is reserved for a later phase
and currently fails explicitly; no integrated provider or production connection
is configured.

## Architecture

The runtime path is UI → foundation feature → foundation service → provider
interface → demo provider. Keep persistence and external-system access behind
service/provider boundaries; do not access either directly from UI code.
