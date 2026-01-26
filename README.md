[![Netlify Status](https://api.netlify.com/api/v1/badges/49e9650f-1906-419b-862f-43a60c7c531b/deploy-status)](https://app.netlify.com/sites/model-blog/deploys)

# Model Blog

A personal blog showcasing miniature painting projects built with Next.js 15, TypeScript, and Tailwind CSS. This is a JAMstack blog that uses MDX for content management, making it easy to maintain and update without a traditional CMS.

The goal is to document painting progress and hopefully provide motivation to paint more models!

## 🚀 Features

- **MDX Content Management**: Write posts in MDX with frontmatter for metadata
- **Image Galleries**: Photoswipe gallery integration for showcasing painted miniatures
- **Video Support**: Embedded video galleries for painting process videos
- **Painting Recipes**: Document painting steps, paints used, and techniques
- **Tag-based Organization**: Categorize projects with tags
- **Dark Mode Support**: Automatic dark mode theming
- **SEO Optimized**: OpenGraph and Twitter Card metadata
- **Asset Optimization**: Scripts for optimizing images and videos
- **S3 Integration**: Upload optimized assets to AWS S3

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with gray-matter for frontmatter
- **Image Gallery**: react-photoswipe-gallery
- **Deployment**: Netlify

## 🎯 Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the blog.

## 📝 Content Structure

Content is stored in `src/content/` as MDX files. Each file represents a blog post about a painting project.

### Basic Frontmatter

```yaml
---
slug: my-project-slug
date: January 2026
title: My Awesome Project
description: A brief description of the project
imageNames:
  - name: image1
  - name: image2
tags:
  - tag1
  - tag2
---
```

### Adding Painting Recipes

To document your painting process, add `paintingSteps` and/or `techniques` to your frontmatter:

```yaml
---
# ... other frontmatter
paintingSteps:
  - step: Priming
    description: How you primed the model
    paints:
      - name: Paint Name
        brand: Brand Name
        range: Product Range (optional)
  - step: Base Coating
    description: Base coat application
    paints:
      - name: Another Paint
        brand: Brand Name
techniques:
  - Airbrush priming
  - Dry brushing
  - Edge highlighting
---
```

### Supported Fields

- `slug`: Unique identifier for the post (required)
- `title`: Post title (required)
- `description`: Short description (required)
- `date`: Publication date (required)
- `imageNames`: Array of image names (required)
- `videoNames`: Array of video names (optional)
- `tags`: Array of tags for categorization (optional)
- `paintingSteps`: Structured painting process (optional)
- `techniques`: List of techniques used (optional)

## 🎨 Assets

### Image Workflow

1. Place original images in a subdirectory matching the post's `slug` within `scripts/media-in/images/` (e.g., `scripts/media-in/images/my-project-slug/`)
2. Run the optimization script:

   ```bash
   npm run optimize-images
   ```

   This creates multiple sizes (small, medium, large) in WebP format

3. Upload to S3:

   ```bash
   npm run upload
   ```

### Video Workflow

1. Place original videos in a subdirectory matching the post's `slug` within `scripts/media-in/videos/` (e.g., `scripts/media-in/videos/my-project-slug/`)
2. Run the video optimization script:

   ```bash
   npm run optimize-videos
   ```

   You may need to install ffmpeg first: `brew install ffmpeg`

3. Upload to S3:

   ```bash
   npm run upload
   ```

### S3 Bucket Structure

Images and videos are served from AWS S3 with the following structure:

```
/images/{slug}/{imageName}-{size}.webp
/videos/{slug}/{videoName}.mp4
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run optimize-images` - Optimize images for web
- `npm run optimize-videos` - Optimize videos for web
- `npm run upload` - Upload assets to S3

## 📦 Project Structure

```
model-blog/
├── src/
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── post/[id]/      # Dynamic post pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   └── content/            # MDX blog posts
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   ├── optimize-images.js
│   ├── optimize-videos.js
│   └── upload-to-s3.js
└── ...config files
```

## 🚀 Deployment

The blog is automatically deployed to Netlify on every push to the main branch. The deployment status badge is shown at the top of this README.

### Environment Variables

Set the following environment variables for S3 uploads:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`

For the Next.js app:

- `NEXT_PUBLIC_AWS_S3_BUCKET` - Public URL to your S3 bucket

## 📄 License

Personal project - feel free to use as inspiration for your own miniature painting blog!
