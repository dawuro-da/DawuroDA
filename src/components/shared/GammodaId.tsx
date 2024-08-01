import React from "react";
import Image from "next/image";

const GammodaId = () => {
  return (
    <div className="flex flex-col pt-1/3 items-center justify-center">
      <div className="flex justify-between shadow-lg border-2 p-5 max-w-5xl">
        <div
          className="w-1/2 flex flex-col justify-center items-center gap-6"
        >
          <div className="relative rounded-full w-40 h-40">
            <Image
              fill
              className="rounded-full object-cover"
              src={"/images/alemtsehay.jpg"}
              alt="Profile-photo"
              style={{ objectFit: "cover" }}
            />
            <Image
              src={"/badges/gold-member.png"}
              alt="badge"
              width={50}
              height={50}
              className="absolute -right-3 bottom-0"
            />
          </div>
          <div className="text-center flex flex-col gap-2">
            <div className="text-sm font-light">Full Name</div>
            <div className="text-3xl font-black">Jubullo Dube</div>

            <p className="text-sm">ID Number: </p>
            <span className="font-black ">MEM0982/16</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <div>
              <span className="font-light text-sm">Sex: </span>
              <span className="font-black">Male</span>
            </div>
            <div>
              <span className="font-light text-sm">Age: </span>
              <span className="font-black">56</span>
            </div>
            <div>
              <span className="font-light text-sm">Occupation: </span>
              <span className="font-black">Farmer</span>
            </div>
            <div>
              <span className="font-light text-sm">Nationality: </span>
              <span className="font-black">Ethiopian</span>
            </div>
            <div>
              <span className="font-light text-sm">Address: </span>
              <span className="font-black">Arbaminch</span>
            </div>
            <div>
              <span className="font-light text-sm">Phone: </span>
              <span className="font-black">097867564534</span>
            </div>
          </div>
        </div>

        {/* container in the right */}
        <div className="w-1/2 flex flex-col items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-lg">Gamo Development Association</p>
            <p className="text-3xl font-black">Members ID Card</p>
          </div>
          <Image
            src={"/badges/gold-member.png"}
            alt="badge"
            width={250}
            height={250}
          />
          <p className="text-center text-xs w-1/2">
            We confirm that the person whose photograph sealed above is a member
            of Gamo Development Association.
          </p>
          <div className="flex gap-6">
            <Image
              src={"/images/logo.svg"}
              alt="badge"
              width={100}
              height={100}
              className="object-cover"
            />
            <div>
              <p className="font-bold text-sm">Contact</p>
              <p>Tel: 0910324567</p>
              <p>0910600719</p>
              <p>0911283675</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GammodaId;
