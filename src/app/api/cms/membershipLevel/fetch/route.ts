import { NextResponse } from "next/server";
import { fetchMembershipLevels } from "@/db/membershipLevel";
import { isStaffSession } from "@/util/session";

// Public — signup/profile/donation forms all need this list to render their
// level dropdowns, same as most other CMS fetch endpoints. Only staff see
// inactive (deactivated) levels; everyone else only sees the active ones.
export async function POST() {
  try {
    const isStaff = await isStaffSession();
    const levels = await fetchMembershipLevels({ activeOnly: !isStaff });

    return NextResponse.json(
      { success: true, value: levels },
      { status: 200 }
    );
  } catch (err) {
    console.warn(err);
    return NextResponse.json(
      { success: false, error: "Unable to fetch membership levels" },
      { status: 500 }
    );
  }
}
