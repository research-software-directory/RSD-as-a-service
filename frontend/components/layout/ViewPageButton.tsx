// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Button from '@mui/material/Button'
import {useRouter} from 'next/router'

type ViewButtonProps = {
  title: string,
  url: string
  disabled: boolean
}

export default function ViewPageButton({title,url,disabled}:ViewButtonProps) {
  const router = useRouter()
  return (
    <Button
      title={title}
      variant="text"
      startIcon={<ArticleOutlinedIcon />}
      sx={{
        minWidth: '6rem'
      }}
      onClick={() => {
        // const slug = router.query['slug']
        router.push(url)
      }}
      disabled={disabled}
    >
      view page
    </Button>
  )
}
