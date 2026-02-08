import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true, isDeleted: false }).select("slug updatedAt");

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:5173/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${blogs
                .map((blog) => {
                    return `
  <url>
    <loc>http://localhost:5173/blog/${blog._id}</loc>
    <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
                })
                .join("")}
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

export default router;
