import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ iconOnly = false, size = "md", href = "/" }) => {
  const iconSizes = {
    sm: 28,  // Dashboard size
    md: 32,  // Navbar size
    lg: 48,  // Auth page size
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg md:text-xl",
    lg: "text-2xl",
  };

  const height = iconSizes[size];

  const content = (
    <div className="flex items-center gap-3 select-none">
      <Image
        src="/logo.png"
        alt="Atom Logo"
        width={height * 1.2} // aspect ratio compensation if needed, let's just make it square or proportional
        height={height}
        className="object-contain"
        priority
      />
      {!iconOnly && (
        <span className={`font-heading font-extrabold tracking-tight text-[#010203] ${textSizes[size]}`}>
          Atom Automation
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};
