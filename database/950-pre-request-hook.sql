-- SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION pre_request_hook() RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS
$$
DECLARE account_authenticated UUID;
BEGIN
	account_authenticated = UUID(CURRENT_SETTING('request.jwt.claims', TRUE)::json->>'account');
	IF account_authenticated IS NOT NULL AND (SELECT account_id FROM locked_account WHERE account_id = account_authenticated) IS NOT NULL THEN
		RAISE EXCEPTION SQLSTATE 'PT403' USING MESSAGE = 'Your account is locked.', DETAIL = COALESCE((SELECT user_facing_reason FROM locked_account WHERE account_id = account_authenticated), 'no reason given');
	END IF;
END
$$;
