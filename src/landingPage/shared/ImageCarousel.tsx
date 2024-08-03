import Navigation from "@/landingPage/navigation/Navigation";
import { Button } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative min-h-[600px] w-full bg-[#333333] z-10 overflow-hidden">
      {images.map((image, index) => (
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
            className="w-[100%] h-[100%] object-cover filter brightness-30"
          />
        </div>
      ))}

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
        {images.map((_, index) => (
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
