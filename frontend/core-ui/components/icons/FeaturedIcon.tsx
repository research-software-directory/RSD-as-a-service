// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// import UpcomingIcon from '@mui/icons-material/Upcoming'
// import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
// import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined'
// import StarsIcon from '@mui/icons-material/Stars'
// import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
// import FlareIcon from '@mui/icons-material/Flare'
// import CampaignIcon from '@mui/icons-material/Campaign'
import AutoAwesome from '@mui/icons-material/AutoAwesome'

export default function FeaturedIcon(){
  return (
    <span
      title="Featured item"
    >
      <AutoAwesome
        sx={{
          width: '3rem',
          height: '3rem',
          opacity: '0.9'
        }}
      />
    </span>
  )
}
