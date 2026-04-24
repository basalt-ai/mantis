import { FaLinkedin } from "react-icons/fa6";
import { SiX, SiYoutube } from "react-icons/si";

const socials = [
  {
    href: "https://x.com/getpancake_ai",
    label: "Pancake on X",
    Icon: SiX,
  },
  {
    href: "https://www.youtube.com/@trypancake",
    label: "Pancake on YouTube",
    Icon: SiYoutube,
  },
  {
    href: "https://www.linkedin.com/company/get-pancake",
    label: "Pancake on LinkedIn",
    Icon: FaLinkedin,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full"
      style={{
        background: "#0a0a0a",
        color: "#9a9a9a",
        borderTop: "3px solid #0a0a0a",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 text-[11px] sm:flex-row sm:gap-0 sm:px-6 sm:text-xs">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-0">
          <span className="whitespace-nowrap">
            © {year} Pancake. All rights reserved.
          </span>
          <span
            aria-hidden
            className="hidden sm:inline-block"
            style={{
              width: 1,
              height: 14,
              background: "#3a3a3a",
              margin: "0 1.25rem",
            }}
          />
          <span className="whitespace-nowrap text-center sm:text-left">
            535 Mission St, San Francisco, CA 94105, États-Unis
          </span>
        </div>

        <div className="flex items-center gap-4 sm:ml-auto">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="transition hover:text-white"
              style={{ color: "#bdbdbd" }}
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
