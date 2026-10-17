import { site } from "@/content/site";
import { SocialLinks } from "@/components/SocialLinks";
import { Year } from "@/components/Year";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <SocialLinks />
        <p>
          &copy; Copyright <Year /> {site.copyrightName}
        </p>
      </div>
    </footer>
  );
}
