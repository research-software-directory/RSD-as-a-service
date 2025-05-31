// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

public enum OpenidProviderAccessMethod {
	MISCONFIGURED {
		@Override
		public boolean isActive() {
			return false;
		}
	},
	DISABLED {
		@Override
		public boolean isActive() {
			return false;
		}
	},
	INVITE_ONLY {
		@Override
		public boolean isActive() {
			return true;
		}
	},
	EVERYONE {
		@Override
		public boolean isActive() {
			return true;
		}
	};

	public abstract boolean isActive();
}
