import Image from "next/image";
import { convertYouTubeURL } from "@/util/helper";
import { useEffect, useState } from "react";

const ImageCarousel = ({
  images,
  youtubeLink,
}: {
  images: string[];
  youtubeLink?: string | null;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const imagesList = youtubeLink ? [youtubeLink, ...images] : images;

  useEffect(() => {
    if (!playing) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
      }, 10000); // Change slide every 10 seconds
      return () => clearInterval(interval);
    }
  }, [playing]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imagesList.length) % imagesList.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative min-h-[600px] w-full bg-[#333333] z-10 overflow-hidden">
      {imagesList.map((image, index) => {
        return youtubeLink && index === 0 ? (
          <div
            onClick={() => setPlaying(true)}
            className={`z-20 w-full h-fit min-h-[600px] absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <iframe
              onMouseEnter={() => setPlaying(true)}
              onMouseLeave={() => setPlaying(false)}
              width="853"
              height="480"
              src={convertYouTubeURL(youtubeLink)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
              className="absolute w-full left-0 top-0 min-h-full"
            />
          </div>
        ) : (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`image${index}`}
              fill
              className="w-[100%] h-[100%] object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        );
      })}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-12 bg-[#00000005] transform -translate-y-1/2  bg-opacity-50 text-white p-2 py-12 rounded-full z-30"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-12 bg-[#0000000 transform -translate-y-1/2 py-12 bg-opacity-50 text-white p-2 rounded-full z-30"
      >
        &#10095;
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {imagesList.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
