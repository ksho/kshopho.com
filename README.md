# kshopho.com

Karl Shouler's photo portfolio, built with [Next.js](https://nextjs.org) and
deployed on Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint
```

## Updating the site

Everything editable lives in two places:

- **`content/site.ts`** – site title, navigation, social links, and the photo
  lists for each gallery (display order = list order). Each photo entry can take
  an optional `focal` point (`"x% y%"`) that decides which part of the image stays
  visible when it is cropped to fill its frame.
- **`public/photos/`** – the photo files themselves (JPEG, PNG or WebP). Upload
  the largest version you have; Next.js resizes and serves optimized copies on
  demand.

To add a photo: drop the file into `public/photos/`, then add
`{ file: "your-file.jpg" }` to `homeGallery` or `railyardGallery` in
`content/site.ts`. Page text lives directly in `app/**/page.tsx`.

## Contact form

`app/api/contact/route.ts` emails submissions through [Resend](https://resend.com).
Set these environment variables in the Vercel project (Settings → Environment
Variables):

| Variable             | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`     | API key from your Resend account                               |
| `CONTACT_TO_EMAIL`   | Address that should receive messages                           |
| `CONTACT_FROM_EMAIL` | Optional verified sender, e.g. `Karl Shouler <hi@kshopho.com>` |

Until they are set the form shows a friendly "not set up yet" message instead
of sending.

## Deploy

Import the repository in Vercel; the defaults (framework: Next.js) are all that
is needed. The old `/index` URL redirects to `/`.
