import Image from "next/image";

const AboutContent = () => {
  return (
    <div className="font-light">
      <p>
        Gamo Development Association (GaDA), is an indigenous, not for profit,
        non-religious and development oriented non-governmental organization,
        which is legally registered in 1985 E.C. as per the rule and regulations
        of NGOs in Ethiopia. Now it has been re-registered as Gamo development
        association according to the current Agency for Civil Societies
        Organization proclamation No, 1113/2019, with a certificate number 1258.
        The head office of the organization is located in Arbaminch, capital of
        Gamo zone and it has 15 branch offices in 14 Woredas and 6 town
        administrations and one branch office located in Addis Ababa, all are
        accountable to the head office.
      </p>
      <br />
      <p>
        The GaDA has more than 350,000 registered individual and 30 corporate
        members. The general assembly is the supreme body, which has overall
        responsibility in decision making system of the association. Board of
        directors is next to general assembly that has also crucial role in
        setting and deciding on policy level issues and developmental direction
        of the organization. The daily operation of the office and projects
        activities are run by the association administrative and program staff.
        Gamo development association/GaDA/ envisions to create prosperous
        society through bringing holistic and sustainable development building
        up on Gamo culture of peace and coexistence. Building its institutional
        capacity, GaDA`s mission is to bring sustainable development in Gamo
        zone, which satisfy real community needs, through mobilizing natural and
        human resources closely working with local community and stakeholders.
      </p>
      <br />
      <p>
        The executive board of GaDA strongly believed and directed that the
        creation of strategic plan document for the coming 5 years from 2021 –
        2025. Accordingly the board assigned strategic plan developing team from
        different academic, expertise and managerial personnel. Strategic
        planning is crucial for GaDA, as it shows the path from current status
        of the organization to where it wants to go and how it will follow the
        path to achieve success. The development of strategic plan will move
        GaDA forward in all dimensions including leadership, management,
        planning and in the implementation process.
      </p>
      <br />
      <Image
        src={"/images/aboutrec.svg"}
        height={20}
        width={20}
        alt=""
        className="w-full"
      />
    </div>
  );
};

export default AboutContent;
