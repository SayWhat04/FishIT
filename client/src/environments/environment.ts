export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL', // e.g. 'https://abcdefghijklmnopqrst.supabase.co'
    key: 'YOUR_SUPABASE_ANON_KEY', // public anon key - safe to include in client code
  },
};

// For TypeScript type checking
declare global {
  interface Window {
    process: {
      env: {
        SUPABASE_URL: string;
        SUPABASE_KEY: string;
      };
    };
  }
}

// Make environment variables available to Node.js process
if (typeof window !== 'undefined') {
  window.process = window.process || ({} as any);
  window.process.env = window.process.env || ({} as any);
  window.process.env.SUPABASE_URL = environment.supabase.url;
  window.process.env.SUPABASE_KEY = environment.supabase.key;
}
