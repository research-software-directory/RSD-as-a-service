// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';
import useSnackbar from '~/components/snackbar/useSnackbar';

export type UpdateProps = {
	id: string;
	key: string;
	value: any;
	origin?: string;
};

type EditableCellProps = {
	params: UpdateProps;
	patchFn?: (
		props: UpdateProps,
	) => Promise<{status: number; message: string}>;
};

export default function EditableCell({patchFn, params}: EditableCellProps) {
	const {showErrorMessage} = useSnackbar();
	const {value} = params;
	const [localValue, setValue] = useState(value);

	// console.group('EditableCell')
	// console.log('params...', params)
	// console.log('value...', value)
	// console.groupEnd()

	useEffect(() => {
		setValue(value);
	}, [value]);

	async function patchValue({target}: {target: HTMLInputElement}) {
		if (target.value !== value && patchFn) {
			const resp = await patchFn({
				...params,
				value: target.value,
			});
			if (resp.status !== 200) {
				// show error message
				showErrorMessage(`Failed to update value. ${resp.message}`);
				// reverse back to orginal value
				setValue(value);
			}
		}
	}

	return (
		<input
			className="p-1 w-full focus:bg-base-200"
			type="text"
			value={localValue}
			onChange={({target}) => setValue(target.value)}
			onKeyDown={e => {
				if (e.key === 'Escape') {
					setValue(value);
				}
			}}
			onBlur={patchValue}
		/>
	);
}
