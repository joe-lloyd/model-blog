[![Netlify Status](https://api.netlify.com/api/v1/badges/49e9650f-1906-419b-862f-43a60c7c531b/deploy-status)](https://app.netlify.com/sites/model-blog/deploys)

# Model Blog

This is a blog for the Model project. It is built with Next.js and Tailwind CSS. The goal is to just build a JAM stack blog that is easy to maintain and update.
It will hopefully give me motivation to paint more models.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Assets

Check out the script folder for 3 useful scripts, one is for image optimization and one is for videos.
I just use simple JS scripts to do this, so you can run them with Node. For videos you may need to install ffmpeg.
After the optimize scripts are run you can then push the files to the s3 bucket on aws.


## Content

The content for the app is organised in MDX files. This basically let me have a serverless CMS.
I use the frontmatter to store metadata about the posts like tags, date etc.
