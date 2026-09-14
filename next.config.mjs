/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
            },
        ],
        // Cost-reduction settings per Vercel's own guidance
        // (vercel.com/docs/image-optimization/managing-image-optimization-costs):
        //  - formats: only emit webp (not avif+webp) — halves the number of
        //    cached variants per image/size with no real quality loss, since
        //    webp is supported by virtually every browser this site sees.
        //  - minimumCacheTTL: 31 days, so a given transformed variant is
        //    reused far longer before Vercel has to redo the work.
        //  - deviceSizes: trimmed from Next's 8-bucket default (which goes
        //    up to 4K/3840px) down to the breakpoints this site actually
        //    renders at — nothing here targets 4K/retina-desktop widths.
        //  (images.qualities isn't available yet on Next 14.2 — this app
        //  never requests a non-default quality anyway, so there's nothing
        //  to lock down until a Next 15 upgrade adds that option.)
        formats: ['image/webp'],
        minimumCacheTTL: 2678400,
        deviceSizes: [640, 750, 1080, 1280, 1920],
    }
};

export default nextConfig;
