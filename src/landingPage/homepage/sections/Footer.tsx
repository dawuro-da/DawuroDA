import Image from "next/image";
import Link from "next/link";

const SocialLink = ({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) => (
  <Link href={href}>
    <Image src={src} height={24} width={24} alt={alt} className="w-6 h-6" />
  </Link>
);

const ContactInfo = () => (
  <div className="mb-6 md:mb-0">
    <h3 className="font-bold text-base mb-2 md:text-left text-center">
      Contact
    </h3>
    <div className="font-light text-sm space-y-4 md:text-left text-center">
      <p>Address: Arbaminch City</p>
      <p>Tel: +251 966 78 90 11</p>
      <p>Tel: +251 966 78 90 11</p>
      <p>
        Email: <Link href="mailto:info@gammoda.com">info@gammoda.com</Link>
      </p>
    </div>
  </div>
);

const FooterLinks = () => (
  <div className="mb-6 md:mb-0 lg:block hidden">
    <h3 className="font-bold text-base mb-2 text-left">Links</h3>
    <ul className="space-y-2">
      {[
        "About Us",
        "Board Members",
        "Initiatives",
        "Vacancies",
        "Resources",
        "FAQ",
      ].map((link, index) => (
        <li key={index} className="text-left">
          <Link href="" className="font-light text-sm space-y-4 text-left ">
            {link}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <div className="bg-[#F1F1F1]">
      <div className="container pt-20 md:pb-6 pb-0 mx-auto flex flex-col w-4/5 md:flex-row justify-between md:items-start items-center px-4">
        <div className="flex flex-col items-start mb-6 md:mb-0">
          <Image
            src="/images/logo.svg"
            height={96}
            width={96}
            alt="Logo"
            className="mb-4 w-full"
          />
          <div className="font-light text-xs flex items-center justify-center w-full mb-4">
            Find us on
          </div>
          <div className="flex space-x-4">
            {[
              { href: "", src: "/images/twitter.svg", alt: "Twitter" },
              { href: "", src: "/images/instagram.svg", alt: "Instagram" },
              { href: "", src: "/images/facebook.svg", alt: "Facebook" },
              { href: "", src: "/images/telegram.svg", alt: "Telegram" },
            ].map((social, index) => (
              <SocialLink
                key={index}
                href={social.href}
                src={social.src}
                alt={social.alt}
              />
            ))}
          </div>
        </div>
        <div className="md:hidden block my-4">
          <div className="flex flex-col items-center">
            <Image
              src={"/images/quotation.svg"}
              height={30}
              width={30}
              alt=""
              className="w-10"
            />
            <div className="font-extrabold text-lg w-full text-center">
              {`Empowering Sustainable Futures"`}
            </div>
            <p className="mt-2 text-sm">Empowering Sustainable Futures</p>
          </div>
        </div>

        <ContactInfo />
        <FooterLinks />
        <div className="md:block hidden">
          <div className="flex flex-col items-start">
            <Image
              src={"/images/quotation.svg"}
              height={30}
              width={30}
              alt=""
              className="w-10 -ml-10"
            />
            <div className="font-extrabold text-2xl w-2/3 text-left">
              {`Empowering Sustainable Futures"`}
            </div>
            <p className="mt-2 text-sm">Empowering Sustainable Futures</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto w-4/5 md:mt-10 mt-0 pb-4 flex md:justify-between justify-center items-center md:border-t border-[#C8C8C8] pt-4">
        <p className="text-sm italic text-[#000000]">
          Copyright &copy; 2024. All rights reserved
        </p>
        <div className="md:block hidden">
          <div className="md:flex space-x-10">
            {[
              "/images/partner1.svg",
              "/images/partner2.svg",
              "/images/partner3.svg",
              "/images/partner4.svg",
              "/images/partner5.svg",
            ].map((src, index) => (
              <Image
                key={index}
                src={src}
                height={10}
                width={10}
                alt={`Partner ${index + 1}`}
                className="w-12"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
