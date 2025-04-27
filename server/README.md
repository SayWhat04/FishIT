# 10xCards Server

## Environment Variables

This server requires environment variables to connect to Supabase and other services. The environment variables are loaded from `.env` files.

### Setting Up Environment Variables

1. Create a `.env` file in the server directory:

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your actual values
nano .env
```

2. Add the following variables to your `.env` file:

```
# Supabase Configuration
SUPABASE_URL=your-supabase-url-here
SUPABASE_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_KEY=your-supabase-service-key-here
```

### Security Considerations

- **NEVER commit `.env` files to version control**
- Add new environment variables to `.env.example` file (without real values) for documentation
- For production, set environment variables through your hosting platform's secure environment variable system
- Consider using a secrets manager for production environments

## Development

To start the development server with environment variables:

```bash
npm run dev
```

The server loads environment variables from `.env` at startup through the configuration in `src/config/environment.ts`. 