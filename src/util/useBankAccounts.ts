import { useEffect, useState } from "react";
import axios from "axios";
import { BankAccount } from "@prisma/client";

// Bank accounts are admin-configurable (see /admin/dashboard/configuration)
// — the "pay by bank transfer" screen fetches the current list through this
// hook instead of hardcoding account numbers anywhere in the UI.
export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await axios.post("/api/cms/bankAccount/fetch");
        if (!cancelled && res.data.success) {
          setAccounts(res.data.value);
        }
      } catch (err) {
        console.warn(err);
      }
      if (!cancelled) setLoading(false);
    };
    fetchAccounts();
    return () => {
      cancelled = true;
    };
  }, []);

  return { accounts, loading };
};
