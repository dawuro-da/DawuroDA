import Image from "next/image";

const PartnerItems: string[] = [
  "/images/partner1.svg",
  "/images/partner2.svg",
  "/images/partner3.svg",
  "/images/partner4.svg",
  "/images/partner5.svg",
];

const Partners = () => {
  return (
    <div className="lg:py-24 py-16">
      <h2 className="font-bold lg:text-4xl md:text-2xl text-xl mb-10 text-center">
        Our Partners
      </h2>
      <div className="flex lg:space-x-20 space-x-8  hiddenscrollbar md:w-2/4 mx-auto ">
        {PartnerItems.map((item, id) => (
          <Image src={item} height={80} width={80} alt="" key={id} />
        ))}
      </div>

      <div className="text-[#FFFFFF] pt-32 text-left px-11 mt-20 lg:bg-[url('/images/partnerbg.svg')] bg-[url('/images/partnerbg2.svg')] lg:h-80 h-96 w-4/5 mx-auto bg-cover">
        <h3 className="lg:text-4xl text-lg font-bold mb-3">
          Support Our Mission: Donate Today!
        </h3>
        <p className="mb-3 font-light">
          Join us in making a lasting impact. Every donation counts!
        </p>
        <button className="px-8 py-2 rounded bg-[#52BE61]">Donate</button>
      </div>
    </div>
  );
};

export default Partners;
