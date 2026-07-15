# Loopr iframe POC

A standalone Vite + React + TypeScript proof of concept that presents `https://dev1.k8.loopr.ai` inside a seamless dashboard shell.

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run Oxlint

## Camera and microphone notes

The embedded Loopr iframe includes:

```html
allow="camera; microphone; autoplay; fullscreen; display-capture"
referrerpolicy="strict-origin-when-cross-origin"
loading="eager"
```

The `allow` attribute is necessary for iframe access to camera, microphone, autoplay, fullscreen, and display capture capabilities. Browser permissions are still required: users must approve camera/microphone prompts, and permissions can also be affected by browser settings or enterprise policy.

This POC intentionally does **not** use an iframe `sandbox` attribute because sandboxing commonly breaks camera/microphone access and other application features unless a long list of exceptions is added. For production, deploy over HTTPS; most browsers require secure contexts for camera and microphone APIs.

## Notes

- No backend is included.
- If the iframe cannot load, the UI shows a graceful unavailable state with retry and external-open actions.
- Whether an external app can be embedded ultimately depends on that app's response headers, such as `X-Frame-Options` and `Content-Security-Policy frame-ancestors`.
