// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useRsdSettings from '~/config/useRsdSettings'

export function useModules() {
  const {host} = useRsdSettings()

  // TODO: change the type of the module parameter to RsdModule when the modules news and user are also in the default settings
  function isModuleEnabled(module: 'software'| 'projects' | 'organisations' | 'communities'): boolean {
    if (host?.modules && host?.modules?.length > 0){
      // include only options defined for this RSD host
      return host.modules.includes(module)
    }
    // else all menuItems are allowed by default
    return true
  }

  return ({
    isModuleEnabled
  })
}
