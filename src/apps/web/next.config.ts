import type {NextConfig} from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ["@raising-atlantic/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Sentry SDK is initialised at runtime via instrumentation.ts +
// sentry.{client,server,edge}.config.ts; source-map upload runs in CI as a
// dedicated `sentry-release` job (see .github/workflows/cd-app.yml) using
// sentry-cli, so we intentionally do NOT wrap next.config with
// `withSentryConfig` here — that wrapper injects a webpack config which
// conflicts with Next.js 16's Turbopack default.
export default withBundleAnalyzer(nextConfig);
