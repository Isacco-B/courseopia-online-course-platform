import { socialLinks } from "@/constants";

export default function DashFooter() {
  // Array contenente i nomi dei social link da includere
  const allowedSocials = ["twitter", "github", "website"];

  return (
    <div className="w-full py-6">
      <div className="flex flex-col gap-4 justify-center items-center md:flex-row md:justify-around">
        <p className="text-sm md:text-[16px] text-slate-600">
          © 2024, made with 💘 by <strong>Isacco Bertoli</strong>
          <span>
            {" "}
            for{" "}
            <strong className="block text-center lg:inline">
              Start2Impact.
            </strong>
          </span>
        </p>
        <div className="flex gap-8">
          {socialLinks
            .filter((link) => allowedSocials.includes(link.name))
            .map((link) => (
              <a
                href={link.href}
                key={link.id}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-slate-800"
              >
                {link.icon}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
