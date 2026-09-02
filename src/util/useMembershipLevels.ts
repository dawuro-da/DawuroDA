import { useEffect, useState } from "react";
import axios from "axios";
import { MembershipLevelConfig } from "@prisma/client";

// Membership levels are admin-configurable (see /admin/dashboard/membership-levels)
// rather than a fixed set, so every form that offers a level dropdown or
// needs to resolve a level's pricing/ID template fetches the current list
// through this one hook instead of hardcoding options.
export const useMembershipLevels = () => {
  const [levels, setLevels] = useState<MembershipLevelConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLevels = async () => {
      setLoading(true);
      try {
        const res = await axios.post("/api/cms/membershipLevel/fetch");
        if (!cancelled && res.data.success) {
          setLevels(res.data.value);
        }
      } catch (err) {
        console.warn(err);
      }
      if (!cancelled) setLoading(false);
    };
    fetchLevels();
    return () => {
      cancelled = true;
    };
  }, []);

  return { levels, loading };
};
