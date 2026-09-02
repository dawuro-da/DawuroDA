"use client";

import { MenuItem, TextField } from "@mui/material";
import { useMemo } from "react";
import {
  ETHIOPIAN_MONTHS,
  daysInEthiopianMonth,
  ethiopianToGregorian,
  gregorianToEthiopian,
} from "@/util/ethiopianCalendar";

// `value`/`onChange` carry the same Gregorian "YYYY-MM-DD" string the old
// native <input type="date"> produced, so the rest of the form (react-hook-
// form field name, server validation, DB column) is unchanged — this just
// replaces how that string gets entered, so members enter (and see) their
// birthdate in the Ethiopian calendar they actually think in, instead of a
// Gregorian date picker being silently misread as an Ethiopian one.
interface EthiopianDateInputProps {
  value?: string | null;
  onChange: (isoDate: string) => void;
  error?: boolean;
  helperText?: string;
}

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

export const EthiopianDateInput = ({
  value,
  onChange,
  error,
  helperText,
}: EthiopianDateInputProps) => {
  const currentEthYear = gregorianToEthiopian(new Date()).year;

  const selected = useMemo(() => {
    if (!value) return { year: 0, month: 0, day: 0 };
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return { year: 0, month: 0, day: 0 };
    return gregorianToEthiopian(parsed);
  }, [value]);

  const emit = (year: number, month: number, day: number) => {
    if (!year || !month || !day) return;
    const clampedDay = Math.min(day, daysInEthiopianMonth(year, month));
    onChange(toIsoDate(ethiopianToGregorian(year, month, clampedDay)));
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => currentEthYear - i
  );
  const dayCount = daysInEthiopianMonth(
    selected.year || currentEthYear,
    selected.month || 1
  );
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-2">
        <TextField
          select
          size="small"
          value={selected.day || ""}
          onChange={(e) =>
            emit(selected.year, selected.month, Number(e.target.value))
          }
          error={error}
          className="w-1/4"
          label="Day"
        >
          {days.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={selected.month || ""}
          onChange={(e) =>
            emit(selected.year, Number(e.target.value), selected.day || 1)
          }
          error={error}
          className="w-2/4"
          label="Month"
        >
          {ETHIOPIAN_MONTHS.map((month, index) => (
            <MenuItem key={month} value={index + 1}>
              {month}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={selected.year || ""}
          onChange={(e) =>
            emit(Number(e.target.value), selected.month || 1, selected.day || 1)
          }
          error={error}
          className="w-1/4"
          label="Year"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {helperText && (
        <span className="text-xs text-red-600">{helperText}</span>
      )}
    </div>
  );
};
