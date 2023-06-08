// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Button from '@mui/material/Button'
import {useRouter} from 'next/router'

type ViewButtonProps = {
  title: string,
  url: string,
  disabled: boolean,
  label: string
}

export default function ViewPageButton({title,label,url,disabled}:ViewButtonProps) {
  const router = useRouter()
  return (
    <Button
      title={title}
      variant="text"
      startIcon={<ArticleOutlinedIcon />}
      sx={{
        minWidth: '6rem',
        textTransform:'capitalize'
      }}
      onClick={() => {
        // const slug = router.query['slug']
        router.push(url)
      }}
      disabled={disabled}
    >
      {/* View page */}
      {label ?? title}
    </Button>
  )
}
