// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import defaultSettings from '~/config/defaultSettings.json'
import {RsdSettingsState} from '../rsdSettingsReducer'

/**
 * getThemeSettings from local json file
 * theme.json can be mounted in the docker image into settings folder.
 * If file is not found we use default settings file
 * @returns
 */

export const getRsdSettings = jest.fn(()=>{Promise.resolve(defaultSettings as unknown as RsdSettingsState)})

/**
 * App server side
 * @returns
 */
export const getAppSettingsServerSide = jest.fn(()=>{Promise.resolve(defaultSettings as unknown as RsdSettingsState)})


/**
 * Get RSD modules from settings.json server side
 * @returns
 */
export const getRsdModules = jest.fn(()=>{Promise.resolve(defaultSettings.modules)})


/**
 * Get RSD modules from settings.json server side
 * @returns
 */
export const getActiveModuleNames = jest.fn(()=>{Promise.resolve(defaultSettings.modules)})
