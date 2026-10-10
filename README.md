# From The Other Side

A web platform for sharing and reading ghostly encounters, with a live paranormal news feed.

## Live Site

**https://from-the-other-side-sfqs.onrender.com**

## Features

- Browse reported paranormal sightings
- Submit your own sightings via the upload form
- Live "news" feed streamed from the server via Server-Sent Events (SSE)

## Tech Stack

- Node.js (no framework) — custom HTTP server
- Plain HTML, CSS, and JavaScript frontend
- `sanitize-html` for input sanitization

## Project Structure

```
server.js                 # HTTP server entry point
index.html                # Frontend markup
style.css                 # Styling
script.js                 # Frontend logic (views, API calls, SSE news)
upload-sightings.js       # Upload form handling
data.json                 # Sighting data store
handlers/                 # Route handlers (GET/POST /api, /api/news)
utils/                    # Helpers (static serving, data I/O, sanitizing)
events/                   # Event emitter for new sightings
render.yaml               # Render deployment config
```

## Run Locally

```bash
npm install
npm start
```

Then open http://localhost:8000

Set a custom port with the `PORT` environment variable:

```bash
PORT=3000 npm start
```

## API

| Method | Route       | Description                          |
| ------ | ----------- | ------------------------------------ |
| GET    | `/api`      | Returns all sightings as JSON        |
| POST   | `/api`      | Adds a new sighting                  |
| GET    | `/api/news` | SSE stream of rotating news headlines |

## Deployment

Deployed on [Render](https://render.com) using the included `render.yaml` blueprint.

> Note: On the free tier the service spins down after inactivity (first request may be slow),
> and file-based data (`data.json`) is not persisted across redeploys.
