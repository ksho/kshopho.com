import { site } from "@/content/site";
import { SocialIcon } from "@/components/Icons";

export function SocialLinks() {
  if (!site.showSocial || site.social.length === 0) return null;
  return (
    <ul className="social">
      {site.social.map((link) => (
        <li key={link.name}>
          <a
            className="social__link"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
            aria-label={link.name}
          >
            <SocialIcon name={link.name} className="social__icon" />
          </a>
        </li>
      ))}
    </ul>
  );
}
