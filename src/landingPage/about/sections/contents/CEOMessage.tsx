import Image from "next/image";

const CEOMessage = () => {
  return (
    <div className="font-light">
      <div className="mb-8">
        <Image
          src={"/images/president.svg"}
          height={20}
          unoptimized
          width={20}
          alt=""
          className="w-full mb-6"
        />
        <p>
          Dr. Demissie Admasu{" "}
          <span className="font-bold">
            CEO, Gamo Development Association
          </span>
        </p>
        <p className="italic">May 20, 2000</p>
      </div>

      <p>
        {`Dear Members; Supporters and partner organizations of Gamo Development
        Association, our association have been able to travel a long distance
        since it’s registered as civil organization. The history of the
        association has three chapters since its establishment in 1950 to its
        current reform activities. The first chapter from 1950 to 1985 the
        association was less active and influential in carrying out
        developmental tasks. Then since 1986 to 2011 the association had started
        to carry out activities but continued less actively engage in
        developmental works and unable to potentially involve in activities. The
        last period was from 2012 to the present time, which is considered to be
        the reform period of the organization.`}
      </p>
      <br />

      <p>
        {`Due to the division of the administrative structure of the zone into two
        in relation to the political and structural reforms carried out in the
        country, Gamo Zone needed to reorganize its own development association
        in accordance with the revised Civil Society Organizations Proclamation
        No. 1113/2011, and our association was recognized by re-registering
        under the agency’s record No. 1258. The time since 2012 is taken to be
        the ‘’Golden time’’ on the history of the association. It’s marked by
        various developmental undertakings with the resources collected by our
        people in addition to the development activities carried out by the
        government for the past 3 years.`}
      </p>

      <br />

      <p>
        {`The reform of the association has focused on 7 thematic areas of
        education‚ health, clean drinking water‚ environmental protection and
        other infrastructure focus areas have been developed, and by investing a
        lot of resources in the sector, various sections of the society have
        been able to benefit. Although the association has carried out many
        problem-solving activities in its long development journey, it has not
        been able to adequately satisfy the people’s desire for development.
        Therefore, in order to satisfy the wide-ranging development needs of our
        people, the association organized branch offices of the development
        association in all the structures of the zone and created a modern and
        strong institutional system for rapid development, especially in
        education & health.`}
      </p>

      <br />
      <p>
        {`By increasing the number of members of the association to bring about a
        real change in the field of agriculture and environment protection as
        well as sustainable livelihood improvement; By mobilizing the society
        and development partners and aligning them with the association,
        institutional reform is being implemented, believing that working in a
        better way than ever to develop a culture of solving problems on his own
        and developing the environment is an inevitable issue.`}
      </p>
      <br />
      <p>
        {`Therefore, dear supporters of our association, by raising our
        development association from its current level, we will carry out the
        development activities required by the time. In order to do it with full
        accountability and in a better way, all the members and supporters of
        the area living in the zone and outside the zone should be members of
        the association, as well as the participation and support of the
        stakeholders is crucial. Finally I would like to inform you that those
        who want to become a member can either come to the GaDA office in person
        or deposit the GaDA account number 1000021467174 at the Commercial Bank
        of Ethiopia.`}
      </p>
    </div>
  );
};

export default CEOMessage;
