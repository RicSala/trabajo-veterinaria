# Stack

## Authentication:

- BetterAuth
- Components: [@daveyplate/better-auth-ui](https://github.com/daveyplate/better-auth-ui)

## Development with Forked Dependencies

We currently use a forked version of `original-package-name` while waiting for our PR to be merged.

### Setting up the link:

```bash
# Clone the fork
git clone https://github.com/yourusername/original-package-name.git
cd original-package-name
pnpm install
pnpm link --global

# Link to your app
cd path/to/your-monorepo/apps/your-next-app
pnpm link --global original-package-name
```
