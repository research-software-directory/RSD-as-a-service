// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export type LayoutType = 'list' | 'grid' | 'masonry';

type ViewToggleGroupProps = {
	layout: LayoutType;
	onSetView: (view: LayoutType) => void;
};

export default function ViewToggleGroup({
	layout,
	onSetView,
}: ViewToggleGroupProps) {
	return (
		<ToggleButtonGroup
			data-testid="card-layout-options"
			orientation="horizontal"
			value={layout}
			size="small"
			exclusive
			onChange={(e, view) => onSetView(view)}
			sx={{
				backgroundColor: 'background.paper',
			}}
		>
			<ToggleButton value="masonry" aria-label="masonry">
				<ViewQuiltIcon />
			</ToggleButton>
			<ToggleButton value="grid" aria-label="grid">
				<ViewModuleIcon />
			</ToggleButton>
			<ToggleButton value="list" aria-label="list">
				<ViewListIcon />
			</ToggleButton>
		</ToggleButtonGroup>
	);
}
