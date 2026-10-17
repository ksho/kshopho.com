import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/content/site";

const title = `Contact + Pricing - ${site.description}`;

export const metadata: Metadata = {
  title,
  alternates: { canonical: "/contact" },
  openGraph: { title, url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="prose">
        <div className="prose__inner">
          <p>
            If you&apos;re interested in working together, I&apos;d love to hear from you!
            <br />
            <br />
          </p>
          <p>
            <strong>Packages and Pricing</strong>
          </p>
          <p>
            For all packages, you can expect images to be fully edited and lightly touched up — you will be
            provided a link to download those images as high-resolution files for printing + sharing as you
            see fit.
          </p>
          <ul>
            <li>
              <p>Short outdoor portraits</p>
              <p>
                1 location, 30 mins, at least 6 images, 1 subject only <strong>[$600]</strong>
              </p>
            </li>
            <li>
              <p>Longer outdoor portraits</p>
              <p>
                2 locations, 1 hour, at least 15 images, 1 subject only <strong>[$900]</strong>
              </p>
            </li>
            <li>
              <p>An evening session (perfect for engagement photos)</p>
              <p>
                Up to 3 locations, 2 hours, about 30 images, up to 2 subjects <strong>[$1250]</strong>
              </p>
              <p>
                <em>Doesn’t have to be in the evening!</em>
              </p>
            </li>
          </ul>
        </div>
      </section>
      <ContactForm />
    </>
  );
}
