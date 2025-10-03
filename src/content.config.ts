import {defineCollection, z} from 'astro:content';
import {glob} from 'astro/loaders';

const blog = defineCollection({
    loader: glob({pattern: "**/*.{md,mdx}", base: "./src/projets"}),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        tags: z.array(z.string()),
        author: z.string(),
        image: z.string().optional()
    })
});

export const collections = {blog};