/**
 * Site content. Edit this file to update the portfolio.
 *
 * Photos live in `public/photos/`. To add one, drop the JPEG in that folder and
 * add an entry to the relevant gallery below (order here is display order).
 * `focal` is an optional CSS object-position ("x% y%") used when an image is
 * cropped to fill its frame; it defaults to "50% 50%" (centered).
 */

export type PhotoEntry = {
  /** File name inside public/photos */
  file: string;
  /** Optional focal point, e.g. "44% 25%" */
  focal?: string;
  /** Optional alt text; defaults to the page title */
  alt?: string;
};

export const site = {
  title: "Karl Shouler",
  subtitle: "Portrait and Lifestyle Photography",
  description: "Philadelphia Portrait Photographer - Karl Shouler",
  url: "https://www.kshopho.com",
  locale: "en-US",
  /** Social links. Hidden unless `showSocial` is true (matches the current site). */
  showSocial: false,
  social: [{ name: "instagram", href: "https://instagram.com/_ksho" }],
  copyrightName: "Karl Shouler",
};

export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Projects",
    children: [{ label: "Discover the Railyard", href: "/discover-the-railyard" }],
  },
  { label: "Contact + Pricing", href: "/contact" },
];

/** Home page filmstrip, in display order. */
export const homeGallery: PhotoEntry[] = [
  { file: "20150814-192134-2-283.jpg", focal: "50% 57%" },
  { file: "20160921-193136-4194-371.jpg" },
  { file: "20161231-192548-5546-951.jpg", focal: "44% 25%" },
  { file: "20170903-192804-6399-527.jpg" },
  { file: "20231122-230122-7746-774.jpg" },
  { file: "20170410-193725-5863-668.jpg", focal: "50% 46%" },
  { file: "20140215-152620-3965-561.jpg", focal: "31% 13%" },
  { file: "20141231-235258-9442-794.jpg", focal: "38% 34%" },
  { file: "20140217-171740-4087-669.jpg", focal: "18% 45%" },
  { file: "20130327-230412-7269-801.jpg" },
  { file: "20180624-150317-6750-855.jpg" },
  { file: "20140217-123621-4044-645.jpg", focal: "69% 3%" },
  { file: "20140620-222851-4675-483.jpg", focal: "65% 55%" },
  { file: "20191026-162022-2536-774.jpg", focal: "53% 19%" },
  { file: "20140702-195019-4854-561.jpg" },
  { file: "20180714-204112-7834-296.jpg", focal: "28% 47%" },
  { file: "20150101-011129-9501-196.jpg", focal: "49% 29%" },
  { file: "20161013-222409-4446-794.jpg", focal: "50% 62%" },
  { file: "20180624-202644-7520-587.jpg" },
  { file: "20140217-185911-4131-937.jpg", focal: "47% 52%" },
  { file: "20160902-185818-4404-461.jpg" },
  { file: "20140217-140630-4068-273.jpg" },
  { file: "20160821-123726-3984-956.jpg", focal: "51% 40%" },
  { file: "20140217-171044-951.jpg", focal: "47% 30%" },
  { file: "20140215-154550-3980-313.jpg", focal: "37% 28%" },
  { file: "20150215-005418-9633-437.jpg" },
  { file: "20141017-235828-1554-932.jpg", focal: "31% 19%" },
  { file: "20141115-111322-1765-463.jpg" },
];

/** "Discover the Railyard" cobblestone gallery, in display order. */
export const railyardGallery: PhotoEntry[] = [
  { file: "20150221-084826-2547-888.jpg" },
  { file: "20150221-083859-2529-906.jpg", focal: "28% 46%" },
  { file: "20150221-084525-2542-689.jpg" },
  { file: "20150221-083741-2525-535.jpg" },
  { file: "20141115-111237-1760-482.jpg" },
  { file: "20141115-111322-1765-807.jpg" },
  { file: "20141115-103937-1720-347.jpg" },
  { file: "20141115-103705-1715-310.jpg" },
  { file: "20141115-111036-1755-416.jpg" },
  { file: "20141115-101437-1698-880.jpg" },
  { file: "20141012-132742-1513-879.jpg" },
  { file: "20141012-132600-1510-164.jpg" },
  { file: "20141012-132121-1493-122.jpg" },
  { file: "20141012-131743-1487-807.jpg" },
  { file: "20141012-131717-1485-924.jpg" },
  { file: "20141012-131455-1479-186.jpg" },
];
