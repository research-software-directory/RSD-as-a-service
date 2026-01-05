// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import EditFab from './EditFab'
import PageContainer from './PageContainer'

type EditButtonProps = {
  title: string,
  url: string,
  isMaintainer: boolean,
  variant:'fab'|'text'|'outlined'|'contained'
}
/**
 * We position edit button in the padding of the next section
 * which is page title.
 * @param param0
 * @returns
 */
export default function EditPageButton({title, url, isMaintainer, variant}: EditButtonProps) {
  // console.log('EditPageButton...', title)
  if (isMaintainer) {
    if (variant === 'fab') {
      // fab is positioned at the top op page title
      // for mobile it will cover part of page title
      return (
        <PageContainer className="px-4 relative">
          <EditFab
            title={title}
            url={url}
          />
        </PageContainer>
      )
    }
    // default button is positioned in the padding of the page title
    // on mobile it will add margin at the top of the page in order to
    // avoid positioning over the page title
    return (
      <PageContainer className="lg:my-0 px-4 my-4 flex justify-end relative">
        <Button
          data-testid="edit-button"
          title={title}
          variant={variant}
          startIcon={<EditIcon />}
          sx={{
            position: 'absolute',
            top: {
              lg:'1rem'
            } ,
            right: {
              lg:'1rem'
            },
            textTransform:'capitalize',
            // we need to overwrite global link styling from tailwind
            // because the type of button is a link (we use href param)
            ':hover':{
              color:'primary.contrastText'
            }
            // minWidth: '6rem'
          }}
          href={url}
          // this causes unexpected error after upgrade to v16
          // LinkComponent={Link}
        >
          {/* Edit page */}
          {title}
        </Button>
      </PageContainer>
    )
  }
  return null
}
