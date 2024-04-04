// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Button from '@mui/material/Button'
import Link from 'next/link'

type ViewButtonProps = {
  title: string,
  url: string,
  disabled: boolean,
  label: string
}

export default function ViewPageButton({title,label,url,disabled}:ViewButtonProps) {
  return (
    <Button
      data-testid="view-page-button"
      title={title}
      variant="contained"
      startIcon={<ArticleOutlinedIcon />}
      sx={{
        minWidth: '6rem',
        textTransform:'capitalize',
        // we need to overwrite global link styling from tailwind
        // because the type of button is a link (we use href param)
        ':hover':{
          color:'primary.contrastText'
        }
      }}
      href={url}
      LinkComponent={Link}
      disabled={disabled}
    >
      {/* View page */}
      {label ?? title}
    </Button>
  )
}
