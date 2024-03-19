import { socialLinks } from "@/constants";

export default function DashFooter() {
  return (
    <div className="w-full py-6">
      <div className="flex flex-col gap-4 justify-center items-center md:flex-row md:justify-around">
        <p className="text-sm  text-center md:text-[16px] text-accent-foreground">
          © 2024, made with 💘 by <strong>Isacco Bertoli</strong> for{" "}
          <strong>Start2Impact.</strong>
        </p>
        <div className="flex gap-8">
          {socialLinks.map((link) => (
            <a
              href={link.href}
              key={link.id}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-accent-foreground"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
