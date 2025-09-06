# Wistia Zapier Integration

A comprehensive Zapier integration for [Wistia](https://wistia.com), a video hosting platform designed for businesses to host, customize, and analyze video content.

## Overview

This integration enables businesses to automate workflows between Wistia and other applications through Zapier, supporting video content management and project organization.

## Use Cases

This integration enables you to:
- **Monitor new videos** published to specific Wistia projects
- **Create new projects** programmatically for organizing video content
- **Automate content workflows** when videos are published
- **Sync video metadata** to CRM, marketing platforms, and databases
- **Trigger notifications** and downstream processes
- **Build content pipelines** connecting Wistia to your existing tools

## Development Journey

This integration was built following the [Zapier Platform CLI Tutorial](https://docs.zapier.com/platform/quickstart/cli-tutorial) with additional customizations for Wistia's specific API requirements.

### Step-by-Step Development Process

#### 1. Initial Setup
```bash
# Create Zapier account
# Visit: https://zapier.com/sign-up

# Ensure Node.js 18.x is installed
node --version

# Install Zapier CLI globally
npm install -g zapier-platform-cli

# Login to Zapier (SSO for Google accounts)
zapier login --sso
```

#### 2. Wistia Account & API Research
- Create Wistia account: https://app.wistia.com/registration/new
- Research Wistia API capabilities
- Create API key with read/create permissions at: `https://{tenant}.wistia.com/account/api`
- Study documentation: https://docs.wistia.com/reference/getting-started-with-the-data-api
- Create Postman collection for API testing and endpoint validation

#### 3. Project Initialization
```bash
# Initialize project with custom authentication (API Key)
zapier init -t custom-auth wistia -l typescript -m commonjs

# Install dependencies
cd wistia && npm install

# Create initial trigger template
zapier scaffold trigger publish
```

#### 4. Implementation Challenges & Solutions

**Challenge: Project ID Discovery**
- Problem: Project IDs are difficult to find in Wistia platform UI
- Solution: Implemented dynamic dropdown using projects API

```bash
# Create dynamic dropdown trigger
zapier scaffold trigger projects
```

**Challenge: Authentication Implementation**
- Implemented Bearer token authentication in middleware.ts
- Added comprehensive documentation for API key generation

**Challenge: Deployment Issues**
- **Issue**: 500 error during push
  - **Solution**: Version bump with `npm version patch -m "bump"`

- **Issue**: "EMFILE: too many open files" during zapier push (macOS)
  - **Solution**: `ulimit -n 8192` or `sudo launchctl limit maxfiles 65536 200000`

- **Issue**: Missing entry point module '/var/task/index.js'
  - **Solution**: Created proper index.js entry point with correct module exports

#### 5. Quality Improvements
- Resolved Zapier validation warnings for better UX
- Implemented dynamic dropdowns for better user experience
- Added direct links to API integration documentation
- Used AI assistance (Claude 4 Sonnet) for complex debugging

#### 6. Testing & Deployment
```bash
# Register and deploy
zapier register && zapier push

# Test integration
# https://zapier.com/editor/319678850/published/319678851/sample
```

## Authentication

Uses **Bearer Token** authentication with your Wistia API key.

### Getting your API Key:
1. Go to your [Wistia Account API settings](https://account.wistia.com/api)  
2. Generate or copy your existing API token
3. Ensure the token has appropriate permissions (read/create)
4. Use your subdomain URL (e.g., `yourcompany.wistia.com` not `tenant.wistia.com`)

**Security Note:** The API key provides access to all projects in your Wistia account. Ensure proper access controls.

## Features

### Triggers

#### New Video in Project
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

**Deduplication:** Uses `id` field to prevent duplicate triggers for the same video.

### Actions

#### Create New Project
**Key:** `upload`  
**Type:** Create action  

Creates a new project in Wistia for organizing video content.

**Input Fields:**
- `name` (required) - Project name
- `adminEmail` (optional) - Admin email address (defaults to account owner)
- `public` (optional) - Boolean for public/private project setting

**Output Fields:**
- `id` - Project ID
- `hashedId` - Hashed identifier
- `name` - Project name
- `description` - Project description
- `mediaCount` - Number of media items
- `created` - Creation timestamp
- `updated` - Last updated timestamp
- `public` - Public project setting
- `anonymousCanUpload` - Upload permissions
- `anonymousCanDownload` - Download permissions
- `adminEmail` - Admin email address

## Architecture & Trade-offs

### Assumptions:
- **Polling-based triggers:** Checks for new videos every few minutes (not real-time webhooks)
- **Project-scoped monitoring:** Each trigger monitors one specific project  
- **Basic pagination:** Fetches recent items per poll cycle
- **Standard error handling:** HTTP status checks and descriptive error messages

### Limitations:
- Not suitable for high-frequency video publishing scenarios
- Slight delay between video publication and trigger execution
- Limited to published content (not drafts or processing videos)

### Technical Stack:
- **Runtime:** Node.js 18.x
- **Language:** TypeScript with strict type checking
- **Platform:** Zapier Platform CLI v17+
- **APIs:** Wistia API v1
- **Authentication:** Bearer Token (API Key)

## Development

### Prerequisites
- Node.js 18.x
- npm or yarn
- Zapier CLI access
- Wistia account with API access

### Local Development

```bash
# Clone and install
npm install

# Build TypeScript
npx tsc

# Validate integration
npx zapier validate

# Run tests (if available)
npm test

# Development build with validation
npm run build
```

### Deployment

```bash
# Build and validate
npm run build

# Deploy to Zapier platform
npx zapier push

# Verify deployment
npx zapier validate
```

### Project Structure
```
wistia/
├── src/
│   ├── authentication.ts     # Bearer token auth configuration
│   ├── index.ts             # Main app definition and exports
│   ├── middleware.ts        # Request/response hooks
│   ├── triggers/
│   │   ├── publish.ts       # New video polling trigger
│   │   └── projects.ts      # Project list (dynamic dropdown)
│   └── creates/
│       └── upload.ts        # Create new project action
├── lib/                     # Compiled JavaScript output
├── index.js                # Entry point for Zapier runtime
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .zapierapprc            # Zapier app configuration
```

## API Endpoints Used

- **Projects:**
  - `GET /v1/projects` - List available projects for dropdowns
  - `POST /v1/projects` - Create new projects
  
- **Media:**
  - `GET /v1/medias` - Fetch videos from specific projects
  - `GET /v1/medias.json` - Authentication testing endpoint

## Common Issues & Solutions

### Development Issues
1. **EMFILE Error (macOS):** Increase file descriptor limit
2. **Module Resolution:** Ensure proper entry point configuration
3. **Authentication Failures:** Verify API key permissions and format
4. **Validation Warnings:** Implement dynamic dropdowns and help text

### API Integration Issues
1. **Project ID Discovery:** Use dynamic dropdown instead of manual entry
2. **Polling Rate Limits:** Respect API rate limits in trigger implementation
3. **Data Consistency:** Implement proper deduplication strategies

## Testing

- **Local Testing:** Use `zapier validate` and `zapier test`
- **Integration Testing:** Test through Zapier editor interface
- **API Testing:** Use Postman collection for endpoint validation

## Resources

- **Wistia API Documentation:** https://wistia.com/support/developers
- **Zapier Platform CLI:** https://platform.zapier.com/cli_docs/docs
- **Zapier CLI Tutorial:** https://docs.zapier.com/platform/quickstart/cli-tutorial
- **TypeScript Configuration:** https://www.typescriptlang.org/docs/

## Support & Contributing

For issues related to:
- **Wistia API:** Consult Wistia developer documentation
- **Zapier Platform:** Reference Zapier CLI documentation  
- **Integration Bugs:** Check validation output and console logs
- **Authentication:** Verify API key permissions and account settings

## Version History

- **v1.0.1:** Project creation action, improved error handling
- **v1.0.0:** Initial release with video monitoring trigger and dynamic project dropdown