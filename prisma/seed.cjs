// One-off content seed for the production DB, run via:
//   node --env-file=.env prisma/seed.cjs
// Uses Neon's HTTP driver (not the normal Postgres TCP driver) because this
// environment can only reach the DB over HTTPS, not raw port 5432.
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const uuid = () => crypto.randomUUID();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}

const now = new Date();
const inDays = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
const monthsAgo = (n) => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - n);
  return d;
};

// Mirrors src/util/date.ts's getEthiopianYear — duplicated here since this
// script runs standalone via node, not through the TS build.
const getEthiopianYear = (date = new Date()) => {
  const gYear = date.getFullYear();
  const isPreLeapYear = (gYear + 1) % 4 === 0;
  const newYearDay = isPreLeapYear ? 12 : 11;
  const newYearThisGregorianYear = new Date(gYear, 8, newYearDay);
  return date >= newYearThisGregorianYear ? gYear - 7 : gYear - 8;
};

async function seedUsers() {
  const users = [
    {
      firstName: "Mike",
      lastName: "Admin",
      email: "mike@gmail.com",
      password: "mike@1234",
    },
    {
      firstName: "Dawuro",
      lastName: "DA",
      email: "dawuroda@gmail.com",
      password: "dawuro@1234",
    },
  ];

  for (const u of users) {
    const existing = await sql`SELECT id FROM users WHERE email = ${u.email}`;
    if (existing.length) {
      console.log("user exists, skipping:", u.email);
      continue;
    }
    const { salt, hash } = await hashPassword(u.password);
    await sql`
      INSERT INTO users
        (id, "firstName", "lastName", email, branch, role, password_salt, password_hash, created_at, updated_at)
      VALUES
        (${uuid()}, ${u.firstName}, ${u.lastName}, ${u.email}, ${"Head Office Branch (Tarcha)"}, 'SuperAdmin', ${salt}, ${hash}, now(), now())
    `;
    console.log("created user:", u.email);
  }
}

async function seedMembers() {
  const branches = [
    "Tarcha Zuria Woreda Branch",
    "Addis Ababa Branch",
    "Esera Woreda Branch",
    "Mareka Woreda Branch",
    "Head Office Branch (Tarcha)",
  ];

  const individuals = [
    {
      firstName: "Selam",
      lastName: "Tesfaye",
      gender: "Female",
      phone: "+251911000001",
      membershipLevel: "Gold",
      contributionAmount: 50,
      branch: branches[0],
      city: "Tarcha",
      paymentMeans: "Office",
      workPlace: "dawuro Zone Education Office",
      expertise: "Education",
    },
    {
      firstName: "Yonas",
      lastName: "Bekele",
      gender: "Male",
      phone: "+251911000002",
      membershipLevel: "Silver",
      contributionAmount: 30,
      branch: branches[1],
      city: "Addis Ababa",
      paymentMeans: "Bank",
      workPlace: "Private Sector",
      expertise: "Finance",
    },
    {
      firstName: "Meron",
      lastName: "Alemu",
      gender: "Female",
      phone: "+251911000003",
      membershipLevel: "Platinum",
      contributionAmount: 100,
      branch: branches[2],
      city: "Esera",
      paymentMeans: "Kebele",
      workPlace: "Esera Health Center",
      expertise: "Public Health",
    },
    {
      firstName: "Biniam",
      lastName: "Girma",
      gender: "Male",
      phone: "+251911000004",
      membershipLevel: "Bronze",
      contributionAmount: 10,
      branch: branches[3],
      city: "Mareka",
      paymentMeans: "Edir",
      workPlace: "Mareka Woreda Administration",
      expertise: "Agriculture",
    },
  ];

  for (const m of individuals) {
    const existing = await sql`SELECT id FROM members WHERE phone = ${m.phone}`;
    if (existing.length) {
      console.log("member exists, skipping:", m.phone);
      continue;
    }
    const { salt, hash } = await hashPassword("mike@1234");
    await sql`
      INSERT INTO members
        (id, "memberId", phone, "membershipLevel", "contributionAmount", "contributionSystem",
         "lastPaidAt", "nextDueDate", "hasPaid", "membershipType", "paymentMeans",
         region, zone, city, "firstName", "lastName", gender, "workPlace", expertise,
         "profileImage", branch, password_salt, password_hash,
         "idRenewedYear", "idRenewedAt", created_at, updated_at)
      VALUES
        (${uuid()}, ${"DaDA" + crypto.randomBytes(4).toString("hex").toUpperCase()}, ${m.phone},
         ${m.membershipLevel}, ${m.contributionAmount}, 'Monthly',
         ${monthsAgo(1)}, ${inDays(30)}, true, 'Individual', ${m.paymentMeans},
         ${"South West Ethiopia Peoples' Region"}, 'dawuro', ${m.city}, ${m.firstName}, ${m.lastName},
         ${m.gender}, ${m.workPlace}, ${m.expertise}, ${"/icons/avatar.svg"}, ${m.branch},
         ${salt}, ${hash},
         ${getEthiopianYear(monthsAgo(1))}, ${monthsAgo(1)}, now(), now())
    `;
    console.log("created member:", m.firstName, m.lastName);
  }

  // one company member
  const companyPhone = "+251911000005";
  const existingCompany = await sql`SELECT id FROM members WHERE phone = ${companyPhone}`;
  if (!existingCompany.length) {
    const { salt, hash } = await hashPassword("mike@1234");
    await sql`
      INSERT INTO members
        (id, "memberId", phone, "membershipLevel", "contributionAmount", "contributionSystem",
         "lastPaidAt", "nextDueDate", "hasPaid", "membershipType", "paymentMeans",
         region, zone, city, "institutionName", "headOrRepresentative", "fieldOfWork",
         branch, password_salt, password_hash,
         "idRenewedYear", "idRenewedAt", created_at, updated_at)
      VALUES
        (${uuid()}, ${"DaDA" + crypto.randomBytes(4).toString("hex").toUpperCase()}, ${companyPhone},
         'Diamond', 6660, 'Monthly',
         ${monthsAgo(1)}, ${inDays(30)}, true, 'Company', 'Bank',
         ${"South West Ethiopia Peoples' Region"}, 'dawuro', 'Tarcha',
         ${"Tarcha General Trading PLC"}, ${"Hana Tadesse"}, ${"General Trading & Import-Export"},
         ${branches[4]}, ${salt}, ${hash},
         ${getEthiopianYear(monthsAgo(1))}, ${monthsAgo(1)}, now(), now())
    `;
    console.log("created company member: Tarcha General Trading PLC");
  } else {
    console.log("member exists, skipping:", companyPhone);
  }
}

async function seedManagement() {
  const boardDescriptionEn =
    "The Board of Directors of the Dawuro Development Association comprises a diverse group of professionals dedicated to the advancement and well-being of the dawuro community. Each board member brings a unique set of skills and experiences that contribute to the strategic direction and governance of the association.";
  const boardDescriptionAm =
    "የዳውሮ ልማት ማህበር የዳይሬክተሮች ቦርድ ለዳውሮ ማህበረሰብ እድገት እና ደህንነት የተሠማሩ ልዩ ልዩ ባለሙያዎችን ያቀፈ ነው። እያንዳንዱ የቦርድ አባል ለማህበሩ ስትራቴጂያዊ አቅጣጫ እና አስተዳደር አስተዋፅኦ የሚያደርጉ ልዩ ችሎታዎችን እና ልምዶችን አሉት።";

  const entries = [
    {
      managerName: "Werku Wedaje",
      managerNameAmharic: "ኢንጂነር ወርቁ ወዳጄ",
      photo: "/images/ceo-werku-wedaje.jpg",
      job: "Chief Executive Officer (CEO)",
      jobAmharic: "ዋና ስራ አስፈጻሚ",
      bio: "Engineer Werku Wedaje serves as Chief Executive Officer of the Dawuro Development Association, leading the association's day-to-day operations and its programs in education, health, water, and environmental protection on behalf of the dawuro community, at home and abroad.",
      bioAmharic:
        "ኢንጂነር ወርቁ ወዳጄ የዳውሮ ልማት ማህበር ዋና ስራ አስፈጻሚ ሲሆኑ የማህበሩን የዕለት ተዕለት ሥራዎች እንዲሁም በትምህርት፣ በጤና፣ በውሃና በአካባቢ ጥበቃ ዘርፍ የሚከናወኑ ፕሮግራሞችን ይመራሉ።",
      isBoardMember: false,
    },
    {
      managerName: "Abate Uqa",
      managerNameAmharic: "አባቴ ኡቃ",
      photo: "/images/board/abate-uqa.jpg",
      job: "Board Member",
      jobAmharic: "የቦርድ አባል",
      bio: boardDescriptionEn,
      bioAmharic: boardDescriptionAm,
      isBoardMember: true,
    },
    {
      managerName: "Admasu Diblo",
      managerNameAmharic: "አድማሱ ድብሎ",
      photo: "/images/board/admasu-diblo.jpg",
      job: "Board Member",
      jobAmharic: "የቦርድ አባል",
      bio: boardDescriptionEn,
      bioAmharic: boardDescriptionAm,
      isBoardMember: true,
    },
    {
      managerName: "Andinet Ashenafi",
      managerNameAmharic: "አንድነት አሸናፊ",
      photo: "/images/board/andinet-ashenafi.jpg",
      job: "Board Member",
      jobAmharic: "የቦርድ አባል",
      bio: boardDescriptionEn,
      bioAmharic: boardDescriptionAm,
      isBoardMember: true,
    },
    {
      managerName: "Arota Albazo",
      managerNameAmharic: "አሮታ አልባዞ",
      photo: "/images/board/arota-albazo.jpg",
      job: "Board Member",
      jobAmharic: "የቦርድ አባል",
      bio: boardDescriptionEn,
      bioAmharic: boardDescriptionAm,
      isBoardMember: true,
    },
    {
      managerName: "Dawit Gebeyehu",
      managerNameAmharic: "ዳዊት ገበየሁ",
      photo: "/images/board/dawit-gebeyehu.jpg",
      job: "Board Member",
      jobAmharic: "የቦርድ አባል",
      bio: boardDescriptionEn,
      bioAmharic: boardDescriptionAm,
      isBoardMember: true,
    },
    {
      managerName: "Dawit Minota",
      managerNameAmharic: "ዳዊት ሚነኖታ",
      photo: "/images/board/dawit-minota.jpg",
      job: "Board Member",
      jobAmharic: "የቦርድ አባል",
      bio: boardDescriptionEn,
      bioAmharic: boardDescriptionAm,
      isBoardMember: true,
    },
  ];

  for (const e of entries) {
    const existing = await sql`SELECT id FROM management WHERE "managerName" = ${e.managerName}`;
    if (existing.length) {
      console.log("management exists, skipping:", e.managerName);
      continue;
    }
    await sql`
      INSERT INTO management
        (id, "managerName", "managerNameAmharic", photo, job, "jobAmharic", bio, "bioAmharic",
         "isDraft", "isBoardMember", created_at, updated_at)
      VALUES
        (${uuid()}, ${e.managerName}, ${e.managerNameAmharic}, ${e.photo}, ${e.job}, ${e.jobAmharic},
         ${e.bio}, ${e.bioAmharic}, false, ${e.isBoardMember}, now(), now())
    `;
    console.log("created management:", e.managerName);
  }
}

async function seedFaq() {
  const faqs = [
    {
      question: "What is the Dawuro Development Association (DawuroDA)?",
      questionAmharic: "ዳልማ (የዳውሮ ልማት ማህበር) ምንድን ነው?",
      answer:
        "Dawuro Development Association (DawuroDA) is an indigenous, not-for-profit, non-religious and development-oriented non-governmental organization, which envisions creating a prosperous society through holistic and sustainable development, built on dawuro's culture of peace and coexistence.",
      answerAmharic:
        "የዳውሮ ልማት ማህበር (ዳልማ) ለትርፍ ያልተቋቋመ እንዲሁም ሃይማኖታዊ ያልሆነ ሃገር በቀል መንግሥታዊ ያልሆነ የልማት ድርጅት ነው፣ በሰላምና ተቻችሎ በአብሮነት የመኖር የዳውሮ ባህል እሴት ላይ የተመሠረተ ሁሉን አቀፍ እና ዘላቂነት ያለውን ልማት በመገንባት የበለፀገ ማህበረሰብ የመፍጠር ራዕይን ሰንቋል።",
    },
    {
      question: "When was DawuroDA established?",
      questionAmharic: "ዳልማ መቼ ተመሰረተ?",
      answer:
        "DawuroDA was founded by the people of dawuro in 1993 E.C. (Ethiopian calendar). It was reorganized in Tir (January) 1993 E.C. and obtained its certificate of legal personality from the then SNNPR Justice Bureau, and was later registered with the Federal Ministry of Justice starting 1998 E.C.",
      answerAmharic:
        "ዳልማ የተቋቆመው በ1993 ዓ.ም ሲሆን ከዚያ በፊት ከዳኮልማ ከዚያም ከወጋጎዳልማ ጋር በደባልነት ሲሠራ ቆይቶ በ1993 ዓ.ም ጥር ወር በአዲስ መልክ ተደራጅቶ ከደ/ብ/ብ/ህ ክልል መንግስት ፍትህ ቢሮ የህጋዊ ሰዉነት ማረጋገጫ ምስክር ወረቀት አግኝቷል፣ ቀጥሎም ከ1998 ዓ.ም ጀምሮ በፌደራል ፍትህ ሚኒስቴር ተመዝግቧል።",
    },
    {
      question: "What is DawuroDA's vision?",
      questionAmharic: "የዳልማ ራዕይ ምንድን ነው?",
      answer:
        "To see the dawuro people fully freed from their current social, economic, and infrastructural challenges, living in favorable, well-developed conditions.",
      answerAmharic:
        "የዳዉሮ ህዝብ አሁን ካለበት ማህበራዊ፣ ኢኮኖሚያዊና ከመሠረተ-ልማት ችግሮች ሙሉ በሙሉ ተላቆ የተመቻቸ ኑሮ ተፈጥሮ ማየት ነዉ፡፡",
    },
    {
      question: "What is DawuroDA's mission?",
      questionAmharic: "የዳልማ ተልእኮ ምንድን ነው?",
      answer:
        "In addition to the government's development efforts, DawuroDA works to mobilize and coordinate the labor, knowledge, financial and material resources of the zone's people and other supporting forces, converting them into development that sustainably improves the community's standard of living.",
      answerAmharic:
        "ዳልማ ከመንግሥት የልማት ጥረት በተጨማሪ የዞኑን ህዝብና ሌሎች ደጋፊ ሃይላት ጉልበት፣ ዕዉቀት፣ ገንዘብና ማቴሪያል ሀብቶችን አቀናጅቶ በማስተባበር ወደ ልማት በመለወጥ በዞኑ ማህበራዊ፣ ኢኮኖሚዊና መሰረተ-ልማት የበኩሉን ድርሻ በማድረግ የህብረተሰቡን የኑሮ ደረጃ በዘላቂነት ለመቀየር መሥራት፡፡",
    },
    {
      question: "How can I become a member?",
      questionAmharic: "እንዴት አባል መሆን እችላለሁ?",
      answer:
        "You can register directly through this website. Click 'Join' in the navigation menu, choose Individual or Company membership, complete the registration form, and select your preferred branch and contribution plan.",
      answerAmharic:
        "በዚህ ድረ-ገጽ በቀጥታ መመዝገብ ይችላሉ። ከላይ ባለው ማውጫ ውስጥ «ይቀላቀሉን»ን በመጫን የግል ወይም የተቋም አባልነትን ይምረጡ፣ የምዝገባ ቅጹን ይሙሉ፣ እንዲሁም የሚፈልጉትን ቅርንጫፍና የመዋጮ እቅድ ይምረጡ።",
    },
    {
      question: "Which area does DawuroDA serve?",
      questionAmharic: "ዳልማ የትኛውን አካባቢ ያገለግላል?",
      answer:
        "DawuroDA serves dawuro Zone, part of the South West Ethiopia Peoples' Regional State, with its head office in Tarcha, and has branches across dawuro's woredas as well as in Addis Ababa, Europe, and North America.",
      answerAmharic:
        "ማህበሩ የደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች ክልላዊ መንግሥት አካል የሆነውን የዳውሮ ዞን የሚያገለግል ሲሆን የዞኑ ዋና ከተማ ታርጫ ናት፣ በዳውሮ ወረዳዎችም ሆነ በአዲስ አበባ፣ አውሮፓና ሰሜን አሜሪካ ቅርንጫፎች አሉት።",
    },
  ];

  for (const f of faqs) {
    const existing = await sql`SELECT id FROM faq WHERE question = ${f.question}`;
    if (existing.length) {
      console.log("faq exists, skipping:", f.question);
      continue;
    }
    await sql`
      INSERT INTO faq (id, question, "questionAmharic", answer, "answerAmharic", "isDraft", created_at, updated_at)
      VALUES (${uuid()}, ${f.question}, ${f.questionAmharic}, ${f.answer}, ${f.answerAmharic}, false, now(), now())
    `;
    console.log("created faq:", f.question);
  }
}

async function seedInitiatives() {
  const initiatives = [
    {
      nameOfInitiative: "Education Access & Quality Improvement",
      nameOfInitiativeAmharic: "የትምህርት ተደራሽነትና ጥራት ማሻሻል",
      featuredImages: ["/images/dawuro-education.webp"],
      body: "Improving access and quality of education is one of DawuroDA's core objectives. The association works alongside government and community structures to expand access to schooling and improve educational quality across dawuro Zone.",
      bodyAmharic:
        "የትምህርት ተደራሽነትና ጥራት ማሻሻል ከዳውሮ ልማት ማህበር ዋና ዓላማዎች አንዱ ነው። ማህበሩ ከመንግስትና ከማህበረሰብ አካላት ጋር በመተባበር በዳውሮ ዞን የትምህርት ተደራሽነትንና ጥራትን ለማሻሻል ይሰራል።",
    },
    {
      nameOfInitiative: "Forestry & Environmental Protection",
      nameOfInitiativeAmharic: "የደን ልማትና አካባቢ ጥበቃ",
      featuredImages: ["/images/forestry.jpg"],
      body: "DawuroDA is committed to ensuring the development of forestry and environmental protection in all zonal districts of dawuro, working with local communities to safeguard natural resources for future generations.",
      bodyAmharic:
        "ዳልማ በዳውሮ ሁሉም የዞን ወረዳዎች የደን ልማትና አካባቢ ጥበቃ ልማትን ለማረጋገጥ ቁርጠኛ ሲሆን ከአካባቢው ማህበረሰብ ጋር በመተባበር የተፈጥሮ ሀብትን ለቀጣይ ትውልድ ለመጠበቅ ይሰራል።",
    },
    {
      nameOfInitiative: "Health & Clean Water Access",
      nameOfInitiativeAmharic: "የጤናና የንፁህ መጠጥ ውሃ አገልግሎት",
      featuredImages: ["/images/dawuro-water-project.webp"],
      body: "DawuroDA works to improve access and quality of health and clean water services across dawuro Zone, in partnership with local health offices and community structures.",
      bodyAmharic:
        "ዳልማ ከአካባቢው የጤና ጽ/ቤቶችና የማህበረሰብ አካላት ጋር በመተባበር በዳውሮ ዞን የጤናና የንፁህ መጠጥ ውሃ አገልግሎት ተደራሽነትና ጥራት ለማሻሻል ይሰራል።",
    },
    {
      nameOfInitiative: "Agricultural & Industrial Development",
      nameOfInitiativeAmharic: "የግብርናና ኢንዳስትሪ ልማት",
      featuredImages: ["/images/dawuro-farm.webp"],
      body: "DawuroDA promotes integrated agricultural and industrial development to sustainably improve the livelihood of the dawuro community.",
      bodyAmharic:
        "ዳልማ የዳውሮ ማህበረሰብን ኑሮ በዘላቂነት ለማሻሻል የተቀናጀ የግብርናና ኢንዳስትሪ ልማትን ያስፋፋል።",
    },
    {
      nameOfInitiative: "Tourism Development in Dawuro Zone",
      nameOfInitiativeAmharic: "በዳውሮ ዞን የቱሪዝም ልማት",
      featuredImages: ["/images/dawuro-buffalo.webp"],
      body: "DawuroDA works to improve, modernize, and expand tourism destinations to increase the economic benefit of the community.",
      bodyAmharic:
        "ዳልማ የማህበረሰቡን ኢኮኖሚያዊ ተጠቃሚነት ለማሳደግ የቱሪዝም መዳረሻዎችን በማሻሻል፣ በማዘመንና በማስፋፋት ይሰራል።",
    },
    {
      nameOfInitiative: "Culture & Language Preservation",
      nameOfInitiativeAmharic: "ባህልና ቋንቋ ጥበቃ",
      featuredImages: ["/images/dawuro-culture-1.webp"],
      body: "DawuroDA studies, organizes, protects, and enriches the culture and language of the ethnic groups in dawuro Zone to introduce them to the world.",
      bodyAmharic:
        "ዳልማ በዞኑ የሚገኙ ብሔረሰቦችን ባህልና ቋንቋ በማጥናት፣ በማደራጀት፣ በመጠበቅና በማበልፀግ ለዓለም ያስተዋውቃል።",
    },
  ];

  for (const i of initiatives) {
    const existing = await sql`SELECT id FROM initiative WHERE "nameOfInitiative" = ${i.nameOfInitiative}`;
    if (existing.length) {
      console.log("initiative exists, skipping:", i.nameOfInitiative);
      continue;
    }
    await sql`
      INSERT INTO initiative
        (id, "nameOfInitiative", "nameOfInitiativeAmharic", "featuredImages", body, "bodyAmharic", "isDraft", created_at, updated_at)
      VALUES
        (${uuid()}, ${i.nameOfInitiative}, ${i.nameOfInitiativeAmharic}, ${i.featuredImages}, ${i.body}, ${i.bodyAmharic}, false, now(), now())
    `;
    console.log("created initiative:", i.nameOfInitiative);
  }
}

async function seedNews() {
  const items = [
    {
      headline: "DawuroDA Advances Access to Quality Education Across Dawuro Zone",
      headlineAmharic: "ዳልማ በዳውሮ ዞን የትምህርት ተደራሽነትና ጥራትን ለማሻሻል ጥረቱን ቀጥሏል",
      profileImage: ["/images/dawuro-education.webp"],
      body: "As part of its core objectives, DawuroDA continues to work with local education offices and partners to improve access and quality of education for children and youth across dawuro Zone.",
      bodyAmharic:
        "ዳልማ ከአካባቢው የትምህርት ጽ/ቤቶችና አጋር ድርጅቶች ጋር በመተባበር በዳውሮ ዞን ለህጻናትና ወጣቶች የትምህርት ተደራሽነትና ጥራትን ለማሻሻል ጥረቱን ቀጥሏል።",
    },
    {
      headline: "Community Forestry and Environmental Protection Efforts Continue in Dawuro",
      headlineAmharic: "የማህበረሰብ ደን ልማትና አካባቢ ጥበቃ ስራዎች በዳውሮ ቀጥለዋል",
      profileImage: ["/images/forestry.jpg"],
      body: "DawuroDA and community members are working together on forestry and environmental protection activities across dawuro's woredas, supporting one of the association's key development goals.",
      bodyAmharic:
        "ዳልማና የማህበረሰብ አባላት በዳውሮ ወረዳዎች የደን ልማትና አካባቢ ጥበቃ ስራዎችን በጋራ በማከናወን ላይ ይገኛሉ።",
    },
    {
      headline: "Improving Health and Clean Water Services for Dawuro Communities",
      headlineAmharic: "ለዳውሮ ማህበረሰብ የጤናና የንፁህ ውሃ አገልግሎትን ማሻሻል",
      profileImage: ["/images/dawuro-water-project.webp"],
      body: "Expanding access to health services and clean drinking water remains a priority for DawuroDA, which works closely with local health structures to reach communities across the zone.",
      bodyAmharic:
        "የጤና አገልግሎትና ንፁህ መጠጥ ውሃ ተደራሽነትን ማስፋት ለዳልማ ትኩረት ከሚሰጣቸው ጉዳዮች አንዱ ሲሆን ከአካባቢው የጤና አካላት ጋር በቅርበት ይሰራል።",
    },
    {
      headline: "Dawuro Zone's Natural and Historical Attractions Offer Growing Tourism Potential",
      headlineAmharic: "የዳውሮ ዞን የተፈጥሮና ታሪካዊ መስህቦች እያደገ የመጣ የቱሪዝም አቅም አላቸው",
      profileImage: ["/images/dawuro-buffalo.webp"],
      body: "dawuro Zone is home to the Chebera Churchura National Park, the ancient Halala stone-walled fortress, the Omo man-made lake, and the Gibe III and IV hydropower dams — a fertile, well-watered area attractive for both living and investment, which DawuroDA sees as a growing opportunity for the community.",
      bodyAmharic:
        "ዳውሮ ዞን ጨበራ ጩርጩራ ብሔራዊ ፓርክ፣ የሀላላ ድንጋይ ካብ፣ የኦሞ ሰው ሰራሽ ሀይቅ እንዲሁም የግቤ ሦስትና አራት ሃይል ማመንጫ ግድቦች የሚገኙበት ለኑሮም ሆነ ለእንቨስትመንት ሳቢ አካባቢ ነው።",
    },
    {
      headline: "DawuroDA Promotes Integrated Agricultural and Industrial Development",
      headlineAmharic: "ዳልማ የተቀናጀ የግብርናና ኢንዱስትሪ ልማትን ያስፋፋል",
      profileImage: ["/images/dawuro-farm.webp"],
      body: "Improving the livelihood of the community in a sustainable manner by promoting integrated agricultural and industrial development remains one of DawuroDA's core objectives across dawuro Zone.",
      bodyAmharic:
        "የተቀናጀ የግብርናና ኢንዳስትሪ ልማት በማስፋፋት በዘላቂነት የማህበረሰቡን ኑሮ ማሻሻል ከዳልማ ዋና ዓላማዎች አንዱ ሆኖ ቀጥሏል።",
    },
    {
      headline: "Strengthening Institutional Capacity Across DawuroDA Branches",
      headlineAmharic: "የዳልማ ቅርንጫፎችን ተቋማዊ አቅም ማጎልበት",
      profileImage: ["/images/dawuro-culture-crowd.webp"],
      body: "DawuroDA continues to enhance its institutional capacity by expanding and coordinating its revenue streams and branch operations across dawuro Zone and the diaspora.",
      bodyAmharic:
        "ዳልማ የገቢ አማራጮቹንና የቅርንጫፍ ስራዎቹን በማስፋፋትና በማቀናጀት ተቋማዊ አቅሙን ማጎልበቱን ቀጥሏል።",
    },
    {
      headline: "DawuroDA Supports Peace and Social Cohesion Initiatives",
      headlineAmharic: "ዳልማ ሰላምና ማህበራዊ ትስስርን የሚያጎለብቱ ስራዎችን ይደግፋል",
      profileImage: ["/images/dawuro-culture-2.webp"],
      body: "DawuroDA promotes democratic thinking and a culture of peace and tolerance to ensure social justice and cohesion across the communities it serves.",
      bodyAmharic:
        "ዳልማ ማህበራዊ ፍትህንና ትስስርን ለማረጋገጥ በሰላምና በመቻቻል ባህል ላይ የተመሰረተ ዲሞክራሲያዊ አስተሳሰብን ያበረታታል።",
    },
    {
      headline: "DawuroDA Advances Disaster Risk Reduction Efforts in Dawuro Zone",
      headlineAmharic: "ዳልማ በዳውሮ ዞን የአደጋ ስጋት መቀነስ ስራዎችን ያራምዳል",
      profileImage: ["/images/haygine.jpg"],
      body: "DawuroDA works to identify disaster risk areas and provide timely response and rehabilitation support when disasters occur in dawuro Zone.",
      bodyAmharic:
        "ዳልማ የአደጋ ስጋት አካባቢዎችን በመለየት አደጋ ሲከሰት ተገቢውን ወቅታዊ ምላሽና መልሶ ማቋቋም ድጋፍ ይሰጣል።",
    },
  ];

  for (const n of items) {
    const existing = await sql`SELECT id FROM news WHERE headline = ${n.headline}`;
    if (existing.length) {
      console.log("news exists, skipping:", n.headline);
      continue;
    }
    await sql`
      INSERT INTO news
        (id, headline, "headlineAmharic", "profileImage", body, "bodyAmharic", "isDraft", created_at, updated_at)
      VALUES
        (${uuid()}, ${n.headline}, ${n.headlineAmharic}, ${n.profileImage}, ${n.body}, ${n.bodyAmharic}, false, now(), now())
    `;
    console.log("created news:", n.headline);
  }
}

async function seedJobs() {
  const jobs = [
    {
      jobTitle: "Project Officer – Education & Health Programs",
      jobTitleAmharic: "ፕሮጀክት ኦፊሰር – ትምህርትና ጤና ፕሮግራሞች",
      jobDescription:
        "DawuroDA is seeking a Project Officer to support the planning and implementation of education and health program activities across dawuro Zone, working closely with local offices and community structures.",
      jobDescriptionAmharic:
        "ዳልማ በዳውሮ ዞን የትምህርትና ጤና ፕሮግራም ስራዎችን ለማቀድና ለመተግበር የሚያግዝ ፕሮጀክት ኦፊሰር ይፈልጋል።",
    },
    {
      jobTitle: "Monitoring & Evaluation (M&E) Officer",
      jobTitleAmharic: "የክትትልና ግምገማ ባለሙያ",
      jobDescription:
        "DawuroDA is seeking a Monitoring & Evaluation Officer to track program performance across its development initiatives and support evidence-based reporting to the Board and partners.",
      jobDescriptionAmharic:
        "ዳልማ የፕሮግራሞችን አፈጻጸም ለመከታተልና ለቦርድና ለአጋር ድርጅቶች ማስረጃ ላይ የተመሰረተ ሪፖርት ለማቅረብ የሚያግዝ የክትትልና ግምገማ ባለሙያ ይፈልጋል።",
    },
  ];

  for (const j of jobs) {
    const existing = await sql`SELECT id FROM job WHERE "jobTitle" = ${j.jobTitle}`;
    if (existing.length) {
      console.log("job exists, skipping:", j.jobTitle);
      continue;
    }
    await sql`
      INSERT INTO job
        (id, "jobTitle", "jobTitleAmharic", "jobDescription", "jobDescriptionAmharic", document, "deadlineDate", "isDraft", created_at, updated_at)
      VALUES
        (${uuid()}, ${j.jobTitle}, ${j.jobTitleAmharic}, ${j.jobDescription}, ${j.jobDescriptionAmharic}, ${""}, ${inDays(30)}, false, now(), now())
    `;
    console.log("created job:", j.jobTitle, "(NOTE: no real document attached yet)");
  }
}

async function seedEvent() {
  const events = [
    {
      headline: "DawuroDA Annual General Assembly & Membership Forum",
      headlineAmharic: "የዳልማ አመታዊ ጠቅላላ ጉባዔና የአባላት መድረክ",
      profileImage: "/images/dawuroda-logo-256.png",
      body: "DawuroDA invites members and stakeholders to its general assembly and membership forum to review the association's activities and plan ahead together.",
      bodyAmharic:
        "ዳልማ አባላትንና ባለድርሻ አካላትን የማህበሩን ስራዎች ለመገምገምና በጋራ ለማቀድ ወደ ጠቅላላ ጉባዔና የአባላት መድረክ ይጋብዛል።",
      startDate: inDays(45),
      endDate: inDays(45),
    },
    {
      headline: "Community Tree Planting and Environmental Protection Day",
      headlineAmharic: "የማህበረሰብ ችግኝ ተከላና የአካባቢ ጥበቃ ቀን",
      profileImage: "/images/forestry.jpg",
      body: "DawuroDA, together with local communities, hosts a tree planting and environmental protection day as part of its ongoing forestry and environmental protection initiative across dawuro Zone.",
      bodyAmharic:
        "ዳልማ ከአካባቢው ማህበረሰብ ጋር በመተባበር ከደን ልማትና አካባቢ ጥበቃ ስራው ጋር በተያያዘ የችግኝ ተከላና የአካባቢ ጥበቃ ቀን ያዘጋጃል።",
      startDate: inDays(20),
      endDate: inDays(20),
    },
    {
      headline: "Community Health and Clean Water Awareness Campaign",
      headlineAmharic: "የማህበረሰብ ጤናና ንፁህ ውሃ ግንዛቤ ማስጨበጫ ዘመቻ",
      profileImage: "/images/dawuro-water-project.webp",
      body: "DawuroDA partners with local health offices to host a community awareness campaign on health and clean water access, supporting its health and clean water initiative across dawuro Zone.",
      bodyAmharic:
        "ዳልማ ከአካባቢው የጤና ጽ/ቤቶች ጋር በመተባበር ከጤናና ንፁህ ውሃ አገልግሎት ስራው ጋር በተያያዘ የማህበረሰብ ግንዛቤ ማስጨበጫ ዘመቻ ያካሂዳል።",
      startDate: inDays(70),
      endDate: inDays(70),
    },
  ];

  for (const e of events) {
    const existing = await sql`SELECT id FROM event WHERE headline = ${e.headline}`;
    if (existing.length) {
      console.log("event exists, skipping:", e.headline);
      continue;
    }
    await sql`
      INSERT INTO event
        (id, headline, "headlineAmharic", "profileImage", body, "bodyAmharic", "isDraft", "startDate", "endDate", created_at, updated_at)
      VALUES
        (${uuid()}, ${e.headline}, ${e.headlineAmharic}, ${e.profileImage}, ${e.body}, ${e.bodyAmharic},
         false, ${e.startDate}, ${e.endDate}, now(), now())
    `;
    console.log("created event:", e.headline);
  }
}

async function seedCampaign() {
  const campaigns = [
    {
      headline: "Join the Campaign: Support Those in Need, Rebuild Lives",
      headlineAmharic: "የዳልማን ዘመቻዎች ይቀላቀሉ፤ የተቸገሩትን ይደግፉ፣ ተስፋን ይጫሩ።",
      description:
        "Together, we can provide urgent relief and restore hope to communities in crisis across dawuro Zone.",
      descriptionAmharic:
        "በጋራ ለዳውሮ ዞን ችግር ላይ ለሚገኙ ማህበረሰቦች አስቸኳይ እርዳታ በመስጠት ተስፋን መመለስ እንችላለን።",
      image: "/images/donationBG.webp",
      goalAmount: 450000,
      raisedAmount: 55000,
      isFeatured: true,
    },
    {
      headline: "Support Clean Water Access in Dawuro Zone",
      headlineAmharic: "በዳውሮ ዞን የንፁህ ውሃ አገልግሎትን ይደግፉ",
      description:
        "Help DawuroDA expand access to clean drinking water and improve health outcomes across dawuro's communities.",
      descriptionAmharic:
        "ዳልማ በዳውሮ ማህበረሰቦች የንፁህ መጠጥ ውሃ ተደራሽነትን በማስፋትና የጤና ውጤቶችን በማሻሻል ይረዱ።",
      image: "/images/dawuro-water-project.webp",
      goalAmount: 200000,
      raisedAmount: 40000,
      isFeatured: false,
    },
    {
      headline: "Support Education for Dawuro's Children",
      headlineAmharic: "ለዳውሮ ልጆች ትምህርትን ይደግፉ",
      description:
        "Contribute to improving access to quality education for children and youth across dawuro Zone.",
      descriptionAmharic:
        "በዳውሮ ዞን ለሚገኙ ህጻናትና ወጣቶች የትምህርት ተደራሽነትና ጥራትን ለማሻሻል አስተዋፅኦ ያድርጉ።",
      image: "/images/dawuro-education.webp",
      goalAmount: 150000,
      raisedAmount: 60000,
      isFeatured: false,
    },
  ];

  for (const c of campaigns) {
    const existing = await sql`SELECT id FROM campaign WHERE headline = ${c.headline}`;
    if (existing.length) {
      console.log("campaign exists, skipping:", c.headline);
      continue;
    }
    await sql`
      INSERT INTO campaign
        (id, headline, "headlineAmharic", description, "descriptionAmharic", image, "goalAmount", "raisedAmount", "isFeatured", "isDraft", "startDate", "endDate", created_at, updated_at)
      VALUES
        (${uuid()}, ${c.headline}, ${c.headlineAmharic}, ${c.description}, ${c.descriptionAmharic}, ${c.image},
         ${c.goalAmount}, ${c.raisedAmount}, ${c.isFeatured}, false, ${inDays(7)}, ${inDays(90)}, now(), now())
    `;
    console.log("created campaign:", c.headline);
  }
}

async function seedResource() {
  const name = "DawuroDA Membership Guide";
  const existing = await sql`SELECT id FROM resource WHERE name = ${name}`;
  if (existing.length) {
    console.log("resource exists, skipping:", name);
    return;
  }
  await sql`
    INSERT INTO resource (id, name, description, document, "isDraft", created_at, updated_at)
    VALUES
      (${uuid()}, ${name}, ${"A guide covering membership levels, contribution plans, and how to register with DawuroDA."}, ${""}, true, now(), now())
  `;
  console.log("created resource:", name, "(NOTE: no real document uploaded yet)");
}

async function seedPartnerships() {
  // Sourced from docs/digital notes for dawuro.docx, section 12 ("ከተቋሙ ጋር
  // አብረው እየሰሩ ያሉ አጋር ተቋማት") — DawuroDA's own list of organizations that
  // have partnered with or supported it. Logos downloaded from each
  // organization's own official site/Wikimedia Commons.
  const partners = [
    {
      partnerName: "A Glimmer of Hope Foundation",
      partnerNameAmharic: "ግሊመር ኦፍ ሆፕ",
      logo: "/images/partners/glimmer-of-hope.png",
      bio: "A U.S.-based nonprofit that has partnered with DawuroDA on health post, clean water, and hospital infrastructure projects across dawuro Zone.",
      bioAmharic:
        "ከዳልማ ጋር በመተባበር በዳውሮ ዞን የጤና ኬላዎችን፣ የንፁህ ውሃ ተቋማትን እና የሆስፒታል መሠረተ ልማቶችን የገነባ በአሜሪካ የሚገኝ መንግስታዊ ያልሆነ ድርጅት።",
    },
    {
      partnerName: "Ripple Effect (formerly Send a Cow)",
      partnerNameAmharic: "ሪፕል ኤፈክት",
      logo: "/images/partners/ripple-effect.webp",
      bio: "An international development organization that has supported agriculture and livestock programs in dawuro Zone.",
      bioAmharic:
        "በዳውሮ ዞን የግብርናና የእንስሳት እርባታ ፕሮግራሞችን የደገፈ ዓለም አቀፍ የልማት ድርጅት።",
    },
    {
      partnerName: "PATH",
      partnerNameAmharic: "PATH",
      logo: "/images/partners/path.png",
      bio: "A global health organization that partnered with DawuroDA on public health awareness initiatives in dawuro Zone.",
      bioAmharic:
        "ከዳልማ ጋር በዳውሮ ዞን የጤና ግንዛቤ ማስጨበጫ ስራዎች የተባበረ ዓለም አቀፍ የጤና ድርጅት።",
    },
    {
      partnerName: "PSI Ethiopia",
      partnerNameAmharic: "PSI/Ethiopia",
      logo: "/images/partners/psi.svg",
      bio: "Population Services International's Ethiopia program, a partner in DawuroDA's HIV/AIDS awareness and prevention campaigns.",
      bioAmharic:
        "በዳልማ የኤች.አይ.ቪ/ኤድስ ግንዛቤ ማስጨበጫና መከላከያ ዘመቻዎች የተባበረ የPSI/Ethiopia ፕሮግራም።",
    },
    {
      partnerName: "British Council",
      partnerNameAmharic: "ብሪትሽ ካውንስል",
      logo: "/images/partners/british-council.svg",
      bio: "Supported cultural and educational initiatives in partnership with DawuroDA.",
      bioAmharic: "ከዳልማ ጋር በባህልና በትምህርት ስራዎች የተባበረ ተቋም።",
    },
    {
      partnerName: "Embassy of Japan in Ethiopia",
      partnerNameAmharic: "የጃፓን ኤምባሲ",
      logo: "/images/partners/embassy-of-japan.svg",
      bio: "A diplomatic partner that has supported DawuroDA's community development projects in dawuro Zone.",
      bioAmharic:
        "በዳውሮ ዞን የዳልማን የማህበረሰብ ልማት ስራዎች የደገፈ የጃፓን ኤምባሲ።",
    },
    {
      partnerName:
        "South Ethiopia Peoples' Development Association (SEPDA)",
      partnerNameAmharic: "የደቡብ ኢትዮጵያ ህዝቦች ልማት ማህበር",
      logo: "/images/partners/sepda.png",
      bio: "A fellow indigenous development association that has collaborated with DawuroDA on regional development initiatives.",
      bioAmharic:
        "ከዳልማ ጋር በክልላዊ የልማት ስራዎች የተባበረ ሌላ ሀገር በቀል የልማት ማህበር።",
    },
  ];

  for (const p of partners) {
    const existing = await sql`SELECT id FROM partnership WHERE "partnerName" = ${p.partnerName}`;
    if (existing.length) {
      console.log("partner exists, skipping:", p.partnerName);
      continue;
    }
    await sql`
      INSERT INTO partnership (id, "partnerName", "partnerNameAmharic", logo, bio, "bioAmharic", "isDraft", created_at, updated_at)
      VALUES (${uuid()}, ${p.partnerName}, ${p.partnerNameAmharic}, ${p.logo}, ${p.bio}, ${p.bioAmharic}, false, now(), now())
    `;
    console.log("created partner:", p.partnerName);
  }
}

async function seedAuctions() {
  const auctions = [
    {
      title: "Sale of Used Association Vehicle (Toyota Land Cruiser)",
      description:
        "DawuroDA invites qualified bidders to participate in the sale of a used Toyota Land Cruiser currently in service at the Head Office. Interested bidders should download the auction document and follow the submission instructions.",
      CPO: 50000,
      formPayment: 500,
      isPurchasing: false,
      startDate: now,
      endDate: inDays(21),
    },
    {
      title: "Supply and Delivery of Office Furniture and Equipment",
      description:
        "DawuroDA invites capable suppliers to bid for the supply and delivery of office furniture and equipment for its branch offices across dawuro Zone.",
      CPO: 20000,
      formPayment: 300,
      isPurchasing: true,
      startDate: now,
      endDate: inDays(14),
    },
    {
      title: "Construction Material Tender – Tarcha Branch Office Renovation",
      description:
        "DawuroDA invites qualified suppliers and contractors to submit bids for the supply of construction materials for the renovation of its Tarcha branch office.",
      CPO: 100000,
      formPayment: 1000,
      isPurchasing: true,
      startDate: now,
      endDate: inDays(30),
    },
  ];

  for (const a of auctions) {
    const existing = await sql`SELECT id FROM auction WHERE title = ${a.title}`;
    if (existing.length) {
      console.log("auction exists, skipping:", a.title);
      continue;
    }
    await sql`
      INSERT INTO auction
        (id, title, description, "CPO", "formPayment", "formFile", "isPurchasing", "startDate", "endDate", created_at, updated_at)
      VALUES
        (${uuid()}, ${a.title}, ${a.description}, ${a.CPO}, ${a.formPayment}, ${""}, ${a.isPurchasing}, ${a.startDate}, ${a.endDate}, now(), now())
    `;
    console.log("created auction:", a.title, "(NOTE: no real auction document attached yet)");
  }
}

async function seedAboutContent() {
  const sections = [
    {
      section: "OUR_STORY",
      title: "Our Story",
      titleAmharic: "የእኛ ታሪክ",
      subtitle: "",
      subtitleAmharic: "",
      body: "Dawuro Development Association (DawuroDA) is an indigenous, not for profit, non-religious and development oriented non-governmental organization founded by the people of dawuro in 1993 E.C. (Ethiopian calendar). Before that date it had operated jointly with the Dacolma and later Wogagoda-DA associations; in Tir (January) 1993 E.C. it was reorganized afresh and obtained its certificate of legal personality from the then SNNPR Justice Bureau. As an association, it is governed under Ethiopia's Civil Code (articles 404–482), was renewed for an indefinite term starting 1996 E.C., and was registered with the Federal Ministry of Justice starting 1998 E.C., where it also signed a program agreement with the Disaster Prevention and Preparedness Agency. The association serves dawuro Zone, part of the South West Ethiopia Peoples' Regional State, with its zonal capital at Tarcha. The general assembly is the supreme body, with overall responsibility for the association's decision-making. The Board of Directors is next in authority, playing a crucial role in setting policy and determining the organization's developmental direction, while day-to-day operations are carried out by the association's administrative and program staff. DawuroDA envisions a prosperous society built on holistic and sustainable development, rooted in the dawuro culture of peace and coexistence. By building institutional capacity and mobilizing natural and human resources, DawuroDA's mission is to bring sustainable development to dawuro Zone that satisfies real community needs through close collaboration with the local community and stakeholders.",
      bodyAmharic:
        "ዳልማ በዳውሮ ሕዝብ ፍላጎት መነሻ ተገቢውን መስፈርት ሞልቶ ህጋዊ ፍቃድ ያገኘ መንግሥታዊ ያልሆነ የግል ድርጅት ነው። ዳልማ የተቋቆመው በ1993 ዓ.ም ሲሆን ከዚያ በፊት ከዳኮልማ ከዚያም ከወጋጎዳልማ ጋር በደባልነት ሲሠራ ቆይቶ በ1993 ዓ.ም ጥር ወር በአዲስ መልክ ተደራጅቶ ከደ/ብ/ብ/ህ ክልል መንግስት ፍትህ ቢሮ የህጋዊ ሰዉነት ማረጋገጫ ምስክር ወረቀት አግኝቷል። ማህበሩ በ1952 ዓ.ም በወጣው የኢትዮጵያ የፍትሐብሔር ህግ ከቁጥር 404 እስከ 482 መሠረት የሚመራና የሚተዳደር ሲሆን ከ1996 ዓ.ም ጀምሮ ተሻሽሎ ላልተወሰነ ጊዜ ተቋቁሟል፣ ቀጥሎም ከ1998 ዓ.ም ጀምሮ በፌደራል ፍትህ ሚኒስቴር ተመዝግቦ ከአደጋ መከላከልና ዝግጅነት ኤጀንሲ ጋር የድርጊት መርሃ ግብር ስምምነት ተፈራርሟል። ማህበሩ የደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች ክልላዊ መንግሥት አካል የሆነውን የዳውሮ ዞን የሚያገለግል ሲሆን የዞኑ ዋና ከተማ ታርጫ ናት። አጠቃላይ ጉባዔው የማህበሩ የበላይ ውሳኔ ሰጪ አካል ሲሆን፣ ከጉባዔው ቀጥሎ የዳይሬክተሮች ቦርድ በፖሊሲ ጉዳዮችና በልማት አቅጣጫዎች ላይ ወሳኝ ሚና ይጫወታል፣ የዕለት ተዕለት ሥራው በጽህፈት ቤቱ አስተዳደር ሰራተኞች ይከወናል። ዳልማ በሰላምና ተቻችሎ በአብሮነት የመኖር የዳውሮ ባህል እሴት ላይ የተመሠረተ ሁሉን አቀፍ/ሁለንተናዊ እና ዘላቂነት ያለውን ልማት በመገንባት የበለፀገ ማህበረሰብ የመፍጠር ራዕይን ሰንቆ፣ የተቋሙን አቅም በመገንባት እና ሀብትን በማሰባሰብ የማህበረሰቡን የልማት ፍላጎት ከማህበረሰቡና ከባለድርሻ አካላት ጋር በቅርበት በመስራት ለማርካት ይተጋል።",
      image: "/images/dawuro-culture-crowd.webp",
    },
    {
      section: "CEO_MESSAGE",
      title: "Engineer Werku Wedaje, CEO, Dawuro Development Association",
      titleAmharic: "ኢንጂነር ወርቁ ወዳጄ፣ የዳውሮ ልማት ማህበር ዋና ስራ አስፈጻሚ",
      subtitle: "",
      subtitleAmharic: "ግንቦት 12፣ 2012",
      body: "Dear sons and daughters of dawuro, dear friends, dear members and supporters of the Dawuro Development Association, and our compatriots both at home and abroad — warm greetings to you all. As is well known, dawuro Zone is one of the six zones of the South West Ethiopia Peoples' Regional State. Tarcha town, the zone's capital, is located 496 km from Addis Ababa, 111 km from Wolaita, and 319 km from Hawassa. dawuro Zone is home to the Chebera Churchura National Park and its rare wildlife, the ancient Halala stone-walled fortress, the Omo man-made lake, and the Gibe III and IV hydropower dams — a fertile, well-watered, temperate area that is attractive for both living and investment. In order to modernize the distribution of membership ID cards and the collection of contributions, and to offer members a convenient and fast service, we have had this platform built. We invite you to become a member through it, and we invite capable partner organizations to work with the association on investment initiatives. Since its establishment in 1993 E.C., the association has, in partnership with various organizations, achieved significant progress in education, health, water, and environmental protection, and we believe your membership, support, and collaboration will help it take one more step forward. As an indigenous, home-grown organization, DawuroDA plans to carry out extensive work in agriculture, education, health, environmental protection, and other sectors going forward, which makes the participation, support, and feedback of our members deeply important. Those who united have made history; those who toiled together have grown; those who worked as one have prospered; those who journeyed together have crossed over. Through coordination, cooperation, mutual support, and working together, let us secure the advancement of the Dawuro Development Association. Thank you.",
      bodyAmharic:
        "የተከበራችሁ የዳውሮ ብሔር ተወላጆችና ወዳጆች፣የተከበራችሁ የዳውሮ ልማት ማህበር አባላትና ደጋፊዎች ክቡራን በሀገር ውስጥም ሆነ ውጭ የሚትገኙ ወገኖቻችን የከበረ ሠላምታዬ ይድረሳችሁ። እንደሚታወቀው ዳውሮ ዞን በደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች ክልላዊ መንግሥት ከሚገኙ ከስድስቱ ዞኖች መካከል አንዱ ዞን ሲሆን የዞኑ እና የደቡብ ምዕራብ ኢትዮጵያ ህዝቦች ክልላዊ መንግሥት ማህበራዊ ክላስተር መቀመጫ የሆነችዉ ታርጫ ከተማ ከአዲስ አበባ በ496 ኪ.ሜ ርቀት ከወላይታ 111 ከ.ሜ እና ከሐዋሳ በ319 ከ.ሜ ትገኛለች፡፡ ዳዉሮ ዞን ጨበራ ጩርጩራ ብሔራዊ ፓርክ የሚገኝበት፣ ብርቅዬ የዱር አራዊቶች የሚኖሩበት፣ ዕድሜ ጠገብና ድንቅ ታሪካዊ ዳራ ያለው የሀላላ ድንጋይ ካብ ያለበት፣በኦሞ ሰው ሰራሽ ሀይቅ የተዋበ፣የግቤ ሦስትና አራት ሃይል ማመንጫ ግድብ የሚያዋስንበት፣ በተፈጥሮ ፀጋ የታደለ ለም መሬት፣ ሰፊ ውሃ፣ ተመጋጋቢና ምቹ አየር ያለበት ለኑሮም ሆነ ለእንቨስትሜንት ሳቢና ማራኪ አካባቢ ነው። ክቡራንና ክቡራት የዳውሮ ተወላጆችና ወዳጆች የአባልነት መታወቂያ ስርጭትና ገቢ አሰባሰብ ሥራን ዘመናዊ መንገድ ተከትለን ለአባላት ምቹና ቀልጣፋ ፈጣን አገልግሎት ለመስጠት ይህንን ሶፕትዌር ትግበራ ሥራ ያሰራን በመሆኑ መተግበሪያውን በመጠቀም አባል እንዲትሆኑ እንዲሁም አቅም ያላችሁ አጋር ድረጅቶች ከልማት ማህበሩ ጋር የኢንቨስትሜንት ሥራ በቅንጅት እንዲትሰሩ ጥሪ እናቀርባለን፡፡ ልማት ማህበሩ በ1993 ዓ.ም ከተቋቆመበት ጊዜ ጀምሮ ከተለያዩ አጋር ድርጅቶች ጋር በመቀናጀት በትምህርት፣በጤና፣በውሃና በአካባቢ ጥበቃ ዘርፍ የላቀ እምርታ ያስመዘገበ ልማት ማህበር ሲሆን የእርስዎ አባልነት፣ደጋፊነትና አብሮ መስራት ልማት ማህበሩ ተጨማሪ አንድ እርምጃ ወደ ፊት ከፍ እንዲል ያግዛል ብለን እናምናለን። ሀገበር በቀል ድርጅት የሆነዉ ዳዉሮ ልማት ማህበር ከዚህ ቀጥሎም በእርሻ፣ በትምህርት፣ በጤና፣ በአከባቢ ጥበቃና በሌሎች ዘርፎች ሰፊ ሥራ ለመሥራት ያቀደ በመሆኑ የአባላት ተሳትፎ ድጋፍና አስተያየት በእጅጉ አስፈላጊ ነዉ፡፡ ጊዜን በአግባቡ በመጠቀም የመፈፀምና የማስፈፀም አቅማችንን በማሻሻል በቴክኖሎጂ የታገዘ ሥራ በማሳለጥ ለተገልጋዮች ቀልጣፋ አገልግሎት ከመስጠትም ባሻገር የልማት ማህበሩ ቅቡልነትና አፈፃፀም ወሰን በማስፋት የማህበርሰቦቻችን ልማት ፍላጎትን ለማረጋገጥ ተግተን እንሰራለን ውጤትም እናመጣለን፡፡ የተባበሩት ታርክ ሰርተዋል፣ አብረዉ የተጉት አድገዋል፣ በአንድነት የሰሩት በልጽገዋል፣በህብረት የተጓዙት ተሻግረዋልና በመቀናጀት፣በመተባበር፣በመተጋገዝና በጋራ በመስራት የዳውሮ ልማት ማህበር እምርታን እናረጋግጥ እላለሁ አመሰግናለሁ።",
      image: "/images/ceo-werku-wedaje.jpg",
    },
    {
      section: "MISSION",
      title: "Mission",
      titleAmharic: "ተልዕኮ",
      subtitle: "",
      subtitleAmharic: "",
      body: "In addition to the government's development efforts, DawuroDA works to mobilize and coordinate the labor, knowledge, financial and material resources of the zone's people and other supporting forces, converting them into development — playing its part in the zone's social, economic and infrastructural progress — in order to sustainably transform the community's standard of living.",
      bodyAmharic:
        "ዳልማ ከመንግሥት የልማት ጥረት በተጨማሪ የዞኑን ህዝብና ሌሎች ደጋፊ ሃይላት ጉልበት፣ ዕዉቀት፣ ገንዘብና ማቴሪያል ሀብቶችን አቀናጅቶ በማስተባበር ወደ ልማት በመለወጥ በዞኑ ማህበራዊ፣ ኢኮኖሚዊና መሰረተ-ልማት የበኩሉን ድርሻ በማድረግ የህብረተሰቡን የኑሮ ደረጃ በዘላቂነት ለመቀየር መሥራት፡፡",
      image: null,
    },
    {
      section: "VISION",
      title: "Vision",
      titleAmharic: "ራዕይ",
      subtitle: "",
      subtitleAmharic: "",
      body: "To see the dawuro people fully freed from their current social, economic, and infrastructural challenges, living in favorable, well-developed conditions.",
      bodyAmharic:
        "የዳዉሮ ህዝብ አሁን ካለበት ማህበራዊ፣ ኢኮኖሚያዊና ከመሠረተ-ልማት ችግሮች ሙሉ በሙሉ ተላቆ የተመቻቸ ኑሮ ተፈጥሮ ማየት ነዉ፡፡",
      image: null,
    },
    {
      section: "OBJECTIVE",
      title: "Objectives",
      titleAmharic: "ዋና ዓላማዎች",
      subtitle: "",
      subtitleAmharic: "",
      body: "",
      bodyAmharic: "",
      items: [
        "Improving the livelihood of the community in a sustainable manner by promoting integrated agricultural and industrial development;",
        "Improving access and quality of education",
        "Improving access and quality of health and clean water services",
        "Ensuring the development of forestry and environmental protection in all zonal districts of dawuro.",
        "Increasing the economic benefit of the community by improving, modernizing and expanding tourism destinations",
        "Ensuring sports development by increasing community participation and sense of ownership",
        "Studying, organizing, protecting and enriching the culture and language of the ethnic groups in the zone so as to introduce to the world",
        "Enhancing institutional capacity by increasing, expanding and coordinating the association's revenue streams",
        "Ensuring social justice and peace by promoting democratic thinking based on the culture of peace and tolerance in the society of the zone",
        "Reducing exposure to disaster by identifying risk areas, providing appropriate timely response and rehabilitation when disaster occurs",
        "To promote the modernization of institutional partnership and coordination system supported by research and study",
      ],
      itemsAmharic: [
        "የተቀናጀ የግብርናና ኢንዳስትሪ ልማት በማስፋፋት በዘላቂነት የማህበረሰቡን ኑሮ ማሻሻል፤",
        "የትምህርት ተደራሽነትና ጥራት ማሻሻል፣",
        "የጤናና የንፁህ መጠጥ ውሃ አገልግሎት ተደራሽነትና ጥራት ማሻሻል፣",
        "በዳውሮ ሁሉም የዞን ወረዳዎች የደን ልማትና አካባቢ ጥበቃ ልማትን ማረጋገጥ፣",
        "የቱሪዝም መዳረሻዎችን በማሻሻል፣ በማዘመንና በማስፋፋት የማህበረሰቡን ኢኮኖሚያዊ ተጠቃሚነት ማሳደግ፤",
        "የማህበረሰብ ተሳትፎና ባለቤትነትን በማሳደግ የስፖርት ልማትን ማረጋገጥ፤",
        "በዞኑ የሚገኙ ብሔረሰቦችን ባህልና ቋንቋ በማጥናት፣ በማደራጀት፣ በመጠበቅና በማበልፀግ ለዓለም ማስተዋወቅ፤",
        "የማህበሩን የገቢ አማራጮችን በማብዛት፣ በማስፋፋትና በማቀናጀት ተቋማዊ አቅምን ማጎልበት፤",
        "በዞኑ ህብረተሰብ ሰላምና ተቻችሎ የመኖር ባህል ላይ የተመሠረተ ዲሞክራሲያዊ አስተሳሰብ በማጎልበት ማህበራዊ ፍትህንና ሰላምን ማረጋገጥ፤",
        "የአደጋ ስጋት አካባቢዎችን በመለየት ተጋላጭነትን መቀነስ፣አደጋ ስከሰት ተገቢውን ወቅታዊ ምላሽ መስጠትና መልሶ ማቋቋም፤",
        "በምርምርና ጥናት የተደገፈ ተቋማዊ አጋርነትንና ቅንጅታዊ አሰራርና ሥርዓትን ማዘመን ማሳደግ፤",
      ],
      image: null,
    },
  ];

  for (const s of sections) {
    const items = s.items ?? [];
    const itemsAmharic = s.itemsAmharic ?? [];
    const existing = await sql`SELECT id FROM about_content WHERE section = ${s.section}`;
    if (existing.length) {
      console.log("about content exists, skipping:", s.section);
      continue;
    }
    await sql`
      INSERT INTO about_content
        (id, section, title, "titleAmharic", subtitle, "subtitleAmharic", body, "bodyAmharic", items, "itemsAmharic", image, "isDraft", created_at, updated_at)
      VALUES
        (${uuid()}, ${s.section}, ${s.title}, ${s.titleAmharic}, ${s.subtitle}, ${s.subtitleAmharic}, ${s.body}, ${s.bodyAmharic}, ${items}, ${itemsAmharic}, ${s.image}, false, now(), now())
    `;
    console.log("created about content:", s.section);
  }
}

async function main() {
  await seedUsers();
  await seedManagement();
  await seedFaq();
  await seedMembers();
  await seedInitiatives();
  await seedNews();
  await seedJobs();
  await seedEvent();
  await seedCampaign();
  await seedResource();
  await seedPartnerships();
  await seedAuctions();
  await seedAboutContent();
  console.log("\nSeed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
