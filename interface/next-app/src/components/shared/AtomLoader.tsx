import React from "react";
import Image from "next/image";

interface AtomLoaderProps {
  size?: number;
}

export const AtomLoader: React.FC<AtomLoaderProps> = ({ size = 48 }) => {
  return (
    <div className="relative animate-spin" style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="Loading..."
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
};
