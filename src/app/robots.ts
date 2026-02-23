import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://polaris-jade-three.vercel.app";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/projects/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}