import Image from "next/image";

interface PhoneFrameProps {
  src: string;
  alt: string;
  dark?: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Every wallpaper is shown the way it will actually be seen: on a phone
 * screen. The frame is drawn with CSS (see .phone-frame in globals.css) so
 * it stays crisp at any size and adopts the surrounding text color.
 */
export function PhoneFrame({ src, alt, dark, priority, sizes }: PhoneFrameProps) {
  return (
    <div className={`phone-frame ${dark ? "phone-frame--dark" : ""}`}>
      <div className="phone-frame__notch" aria-hidden="true" />
      <div className="phone-frame__screen">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 45vw, 320px"}
          priority={priority}
          unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
        />
      </div>
    </div>
  );
}
