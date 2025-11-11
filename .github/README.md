# GitHub Workflows

## Workflows

### ci.yml
- Runs on PRs and pushes to `main`
- Tests, linting, security scans
- Dependency review on PRs

### publish.yml
- Runs on push to `main` (automatic)
- Manual trigger available via workflow_dispatch
- Publishes to npm with provenance

## Setup Required

1. **NPM_TOKEN**: Create an Automation token on npmjs.com and add it to repository secrets
2. **Branch Protection**: Enable on `main` branch to require PR reviews

## Publishing

Update version in `package.json`, merge to `main`, and publish happens automatically.

