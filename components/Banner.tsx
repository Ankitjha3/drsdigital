import Link from "next/link";

interface BannerProps {
  imageUrl?: string;
  title?: string;
  link?: string;
}

export default function Banner({ imageUrl, title, link }: BannerProps) {
  const content = (
    <div className="relative h-64 md:h-96 rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title || "Banner"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{title || "Banner"}</span>
        </div>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}

