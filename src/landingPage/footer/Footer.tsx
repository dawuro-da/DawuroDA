"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const SocialLink = ({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) => (
  <Link href={href} target="_blank">
    <Image src={src} height={24} width={24} alt={alt} className="w-6 h-6" />
  </Link>
);

const ContactInfo = ({ t }: { t: any }) => (
  <div className="flex-1 flex flex-col items-center">
    <div id="contact-us" className="mb-6 md:mb-0">
      <h3 className="font-bold text-base mb-2 md:text-left text-center">
        {t("footer.contact")}
      </h3>
      <div className="font-light text-sm space-y-4 md:text-left text-center">
        <p className="flex flex-row gap-1 justify-start items-start">
          <span className="flex flex-row items-center w-fit">Tel:</span>
          <span className="flex flex-col gap-2">
            <Link href="tel:0910324567">
              <span className="pl-4 hover:underline">0910324567</span>
            </Link>
            <Link href="tel:0910600719">
              <span className="pl-4 hover:underline"> 0910600719</span>
            </Link>
            <Link href="tel:0911283675">
              <span className="pl-4 hover:underline"> 0911283675</span>
            </Link>
            <Link href="tel:0468814846">
              <span className="pl-4 hover:underline"> 0468814846</span>
            </Link>
            <Link href="tel:0468810434">
              <span className="pl-4 hover:underline"> 0468810434</span>
            </Link>
          </span>
        </p>
        <p>
          Email:{" "}
          <Link href="mailto:info@gammoda.com" className="hover:underline">
            info@gammoda.org
          </Link>
        </p>
        <p>PO. Box:- 72 Arba minch</p>
      </div>
    </div>
  </div>
);

const FooterLinks = ({ t }: { t: any }) => {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="mb-6 md:mb-0 lg:block hidden">
        <h3 className="font-bold text-base mb-2 text-left">
          {t("footer.links")}
        </h3>
        <ul className="space-y-2">
          {[
            { link: "/about", name: "About Us" },
            { link: "/news", name: "News" },
            { link: "/#initiatives", name: "Initiatives" },
            { link: "/vacancies", name: "Vacancies" },
            { link: "/resources", name: "Resources" },
            { link: "/#faqs", name: "FAQ" },
          ].map((item, index) => (
            <li key={index} className="text-left">
              <Link
                href={item.link}
                className="font-light text-sm space-y-4 text-left"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#F1F1F1] xl:lg:px-40 md:px-20 px-10">
      <div className="px-6  container pt-20 md:pb-6 pb-0 w-full grid md:grid-cols-4 gap-6 items-center">
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <Image
            src="/images/logo.svg"
            height={96}
            width={96}
            alt="Logo"
            className="mb-4 w-full max-w-[200px]"
          />
          <div className="font-light text-xs flex items-center justify-center w-full mb-4">
            {t("footer.social_media_footer")}
          </div>
          <div className="flex space-x-4">
            {[
              // { href: "", src: "/images/twitter.svg", alt: "Twitter" },
              // { href: "", src: "/images/instagram.svg", alt: "Instagram" },
              {
                href: "https://www.facebook.com/gamodevelopmentassociation?mibextid=ZbWKwL",
                src: "/images/facebook.svg",
                alt: "Facebook",
              },
              {
                href: "https://t.me/gammoda",
                src: "/images/telegram.svg",
                alt: "Telegram",
              },
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
              {`${t("footer.motto")}"`}
            </div>
            <p className="mt-2 text-sm">{t("footer.motto")}</p>
          </div>
        </div>

        <ContactInfo t={t} />
        <FooterLinks t={t} />
        <div className="min-w-fit flex-1 flex flex-row justify-end">
          <div className="md:block hidden">
            <div className="md:flex hidden flex-col items-start w-fit ">
              <Image
                src={"/images/quotation.svg"}
                height={30}
                width={30}
                alt=""
                className="w-10 -ml-10"
              />
              <div className=" font-extrabold text-2xl text-left">
                {`${t("footer.motto1")}`}
                <br />
                {`${t("footer.motto2")}"`}
              </div>
              <p className="mt-2 text-sm">{t("footer.motto")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto w-full md:mt-10 mt-0 pb-4 flex xl:lg:flex-row md:flex-row gap-4 flex-col md:justify-between justify-center items-center md:border-t border-[#C8C8C8] pt-4">
        <span className="flex xl:lg:flex-row md:flex-row flex-col xl:lg:gap-4 gap-2 items-center justify-center text-sm">
          <Link href="/privacy-policy">
            <span className="pl-4 hover:underline">
              {t("footer.privacy_policy")}
            </span>
          </Link>
          <Link href="/terms-and-conditions">
            <span className="pl-4 hover:underline">
              {t("footer.terms_and_conditions")}
            </span>
          </Link>
        </span>
        <p className="text-sm italic text-[#000000]">{t("footer.copyright")}</p>
      </div>
    </div>
  );
};

export default Footer;
