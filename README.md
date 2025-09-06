# Wistia Zapier Integration

A Zapier integration for [Wistia](https://wistia.com), a video hosting platform designed for businesses to host, customize, and analyze video content.

## Use Cases

This integration enables you to:
- **Automate workflows** when new videos are published to Wistia projects
- **Sync video metadata** to other tools (CRM, marketing platforms, databases)
- **Trigger notifications** when content is published
- **Build content pipelines** connecting Wistia to your existing tools

## Authentication

Uses **Bearer Token** authentication with your Wistia API key.

**Getting your API Key:**
1. Go to your [Wistia Account API settings](https://account.wistia.com/api)  
2. Generate or copy your existing API token
3. Use your subdomain URL (e.g., `yourcompany.wistia.com` not `tenant.wistia.com`)

**Note:** The API key provides access to all projects in your Wistia account. Ensure proper access controls.

## Triggers

### New Video in Project
**Key:** `publish`  
**Type:** Polling trigger  

Monitors a specific Wistia project for newly published videos.

**Input Fields:**
- `project_id` (required) - Dynamic dropdown populated from your Wistia projects

**Output Fields:**
- `id` - Unique video ID  
- `hashed_id` - Wistia's hashed identifier
- `name` - Video title
- `duration` - Video length in seconds
- `description` - Video description  
- `status` - Processing status (`ready`, `processing`, etc.)
- `created` - Publication timestamp
- `updated` - Last modified timestamp
- `thumbnail` - Thumbnail image data
- `assets` - Available video files and formats

**Deduplication:** Uses `id` field to prevent duplicate triggers for the same video.

## Architecture & Trade-offs

**Assumptions:**
- **Polling-based:** Checks for new videos every few minutes (not real-time webhooks)
- **Project-scoped:** Monitors one project per trigger configuration  
- **Basic pagination:** Fetches most recent 10 videos per poll
- **Simple error handling:** Basic HTTP status checks and error messages

**Limitations:**
- Not suitable for high-frequency video publishing scenarios
- May have slight delay between video publication and trigger execution
- Limited to videos marked as "published" (not drafts or processing videos)

**Technical Stack:**
- TypeScript with Zapier Platform CLI v17+
- Wistia API v1
- Node.js 18.x runtime

## Development

### Prerequisites
- Node.js 18.x
- npm
- Zapier CLI access

### Local Development

```bash
# Install dependencies
npm install

# Build TypeScript
npx tsc

# Validate integration
npx zapier validate

# Run tests
npm test
```

### Deployment

```bash
# Build and validate
npm run build

# Deploy to Zapier
npx zapier push
```

### Project Structure
```
src/
├── authentication.ts    # Bearer token auth config
├── index.ts            # Main app definition  
├── middleware.ts       # Request/response hooks
└── triggers/
    ├── publish.ts      # New video trigger
    └── projects.ts     # Project list (for dropdowns)
dist/                   # Compiled JavaScript
index.js               # Entry point for Zapier runtime
```

## API Endpoints Used

- `GET /v1/medias` - Fetch videos from projects
- `GET /v1/projects` - List available projects  
- `GET /v1/medias.json` - Authentication test endpoint

## Support

For Wistia API documentation: https://wistia.com/support/developers  
For Zapier Platform CLI: https://platform.zapier.com/cli_docs/docs