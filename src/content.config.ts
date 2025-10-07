import {defineCollection, z} from 'astro:content';
import {glob} from 'astro/loaders';

let blog

try {
    blog = defineCollection({
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
} catch (error) {
    console.log(error)
}


export const collections = {blog};