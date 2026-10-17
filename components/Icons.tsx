import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function MenuIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 10" aria-hidden="true" focusable="false" {...props}>
      <rect x="0" y="0" width="24" height="1.4" />
      <rect x="0" y="8.6" width="24" height="1.4" />
    </svg>
  );
}

export function CloseIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M3.5 2 22 20.5 20.5 22 2 3.5z" />
      <path d="M20.5 2 22 3.5 3.5 22 2 20.5z" />
    </svg>
  );
}

export function ChevronLeftIcon(props: Props) {
  return (
    <svg viewBox="0 0 44 81" aria-hidden="true" focusable="false" {...props}>
      <path d="M41 1.5 43.2 3.7 6.5 40.5 43.2 77.3 41 79.5 1 40.5z" />
    </svg>
  );
}

export function ChevronRightIcon(props: Props) {
  return (
    <svg viewBox="0 0 44 81" aria-hidden="true" focusable="false" {...props}>
      <path d="M3 1.5 0.8 3.7 37.5 40.5 0.8 77.3 3 79.5 43 40.5z" />
    </svg>
  );
}

export function InstagramIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM17.6 5.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
    </svg>
  );
}

const socialIcons: Record<string, (props: Props) => React.JSX.Element> = {
  instagram: InstagramIcon,
};

export function SocialIcon({ name, ...props }: Props & { name: string }) {
  const Icon = socialIcons[name];
  return Icon ? <Icon {...props} /> : null;
}
