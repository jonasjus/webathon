import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  initials: string;
  color: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, initials, color, size = 44, className = "" }: AvatarProps) {
  const style = { width: size, height: size, minWidth: size };

  if (src) {
    return (
      <Image
        src={src}
        alt={initials}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${className}`}
      style={{ ...style, backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
