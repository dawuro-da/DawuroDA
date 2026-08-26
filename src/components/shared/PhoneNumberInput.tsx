import "react-international-phone/style.css";

import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

export interface PhoneNumberInputProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string) => void;
}

export const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(({ value, onChange, ...others }, forwardedRef) => {
  const { handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "et",
      value,
      countries: defaultCountries,
      onChange: (data: any) => {
        onChange(data.inputValue);
      },
    });

  const setRefs = (node: HTMLInputElement) => {
    inputRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <TextField
      variant="standard"
      color="primary"
      placeholder="Phone number"
      value={value}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={setRefs}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: "2px", marginLeft: "-8px" }}
          >
            <Select
              defaultValue={country}
              placeholder="926970261"
              MenuProps={{
                style: {
                  height: "300px",
                  width: "360px",
                  top: "10px",
                  left: "-34px",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
              sx={{
                width: "max-content",
                // Remove default outline (display only on focus)
                fieldset: {
                  display: "none",
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: "none",
                  },
                },
                // Update default spacing
                ".MuiSelect-select": {
                  padding: "8px",
                  paddingRight: "24px !important",
                },
                svg: {
                  right: 0,
                },
              }}
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => (
                <FlagImage iso2={value.iso2} style={{ display: "flex" }} />
              )}
            >
              {defaultCountries.map((c: any) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: "8px" }}
                    />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...others}
    />
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";
