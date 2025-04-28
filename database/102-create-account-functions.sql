-- SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION delete_account(account_id UUID) RETURNS VOID LANGUAGE plpgsql VOLATILE AS
$$
DECLARE account_authenticated UUID;
BEGIN
	IF
		account_id IS NULL
	THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide an account id';
	END IF;
	account_authenticated = uuid(current_setting('request.jwt.claims', TRUE)::json->>'account');
	IF
			CURRENT_USER IS DISTINCT FROM 'rsd_admin'
		AND
			(SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE
		AND
			(
				account_authenticated IS NULL OR account_authenticated IS DISTINCT FROM account_id
			)
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to delete this account';
	END IF;
	DELETE FROM maintainer_for_software WHERE maintainer = account_id;
	DELETE FROM maintainer_for_project WHERE maintainer = account_id;
	DELETE FROM maintainer_for_organisation WHERE maintainer = account_id;
	DELETE FROM maintainer_for_community WHERE maintainer = account_id;
	DELETE FROM invite_maintainer_for_software WHERE created_by = account_id OR claimed_by = account_id;
	DELETE FROM invite_maintainer_for_project WHERE created_by = account_id OR claimed_by = account_id;
	DELETE FROM invite_maintainer_for_organisation WHERE created_by = account_id OR claimed_by = account_id;
	DELETE FROM invite_maintainer_for_community WHERE created_by = account_id OR claimed_by = account_id;
	UPDATE organisation SET primary_maintainer = NULL WHERE primary_maintainer = account_id;
	UPDATE community SET primary_maintainer = NULL WHERE primary_maintainer = account_id;
	UPDATE contributor SET account = NULL WHERE account = account_id;
	UPDATE team_member SET account = NULL WHERE account = account_id;
	DELETE FROM admin_account WHERE admin_account.account_id = delete_account.account_id;
	DELETE FROM login_for_account WHERE account = account_id;
	DELETE FROM user_profile WHERE account = account_id;
	DELETE FROM account WHERE id = account_id;
END
$$;
