// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect } from "react";
import { FieldErrors } from "react-hook-form";

type SubmitButtonProps<T> = {
  loading: boolean;
  error: string;
  formErrors: FieldErrors;
  isValid: boolean;
};

export default function SubmitButtonWithListener<T>({loading, error, formErrors, isValid,}: SubmitButtonProps<T>) {
  function isSaveDisabled() {
    if (loading == true) return true;
    // when manually setting errors, like with brand_name async validation
    // we also need to ensure these errors are handled here
    if (formErrors && formErrors?.slug) return true;
    if (isValid === false) return true;
    return false;
  }

  const handleCtrlEnter = (event: KeyboardEvent) => {
    if (event.key == "Enter" && event.ctrlKey) {
      document.getElementById("save-button")?.click();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleCtrlEnter);
    return () => {
      window.removeEventListener("keydown", handleCtrlEnter);
    };
  });

  return (
    <Button
      type="submit"
      id="save-button"
      variant="contained"
      sx={{
        // overwrite tailwind preflight.css for submit type
        '&[type="submit"]:not(.Mui-disabled)': {
          backgroundColor: "primary.main",
        },
      }}
      endIcon={<SaveIcon />}
      disabled={isSaveDisabled()}
    >
      Save
    </Button>
  );
}
