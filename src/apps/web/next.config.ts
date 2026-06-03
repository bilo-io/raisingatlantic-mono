import type {NextConfig} from 'next';
import {withSentryConfig} from '@sentry/nextjs';
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

// Sentry build-time wrapper. Source-map upload runs in CI (cd-app.yml) using
// `SENTRY_AUTH_TOKEN`; `SENTRY_ORG` and `SENTRY_PROJECT` are read from env.
// `silent` suppresses noisy build logs in CI.
export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT_WEB ?? 'ra-web-prod',
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
