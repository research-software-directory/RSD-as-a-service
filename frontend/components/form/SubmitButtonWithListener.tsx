// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useRef, useCallback} from 'react'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'

type SubmitButtonProps = {
  formId: string
  disabled: boolean
}

export default function SubmitButtonWithListener({disabled,formId}: SubmitButtonProps) {
  const btnRef:any = useRef(undefined)

  const handleCtrlEnter = useCallback((event: KeyboardEvent) => {
    if (event.key == 'Enter' && event.ctrlKey && disabled===false) {
      btnRef.current.click()
    }
  }, [disabled])

  // console.group('SubmitButtonWithListener')
  // console.log('disabled...', disabled)
  // console.groupEnd()

  useEffect(() => {
    window.addEventListener('keydown', handleCtrlEnter)
    return () => {
      window.removeEventListener('keydown', handleCtrlEnter)
    }
  },[handleCtrlEnter])

  return (
    <Button
      ref={btnRef}
      type="submit"
      id="save-button"
      variant="contained"
      tabIndex={0}
      form={formId}
      sx={{
        // overwrite tailwind preflight.css for submit type
        '&[type="submit"]:not(.Mui-disabled)': {
          backgroundColor: 'primary.main',
        },
      }}
      endIcon={<SaveIcon />}
      disabled={disabled}
    >
      Save
    </Button>
  )
}
