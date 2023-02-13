-- SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- Checks whether the user agreed to the RSD terms and pricacy statement
CREATE FUNCTION check_user_agreement_on_action() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	IF
		CURRENT_USER <> 'rsd_admin' AND NOT
		(SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) AND
		(SELECT * FROM user_agreements_stored(uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'))) = FALSE
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You need to agree to our Terms of Service and the Privacy Statement before proceeding. Please open your user profile settings to agree.';
	ELSE
		RETURN NEW;
	END IF;
END
$$;

-- Triggers for UPDATE
CREATE PROCEDURE check_user_agreement_on_update_all_tables() LANGUAGE  plpgsql AS
$$
DECLARE
	_sql VARCHAR;
BEGIN
	FOR _sql IN SELECT CONCAT (
		'CREATE TRIGGER check_',
		quote_ident(table_name),
		'_before_update BEFORE UPDATE ON ',
		quote_ident(table_name),
		' FOR EACH STATEMENT EXECUTE FUNCTION check_user_agreement_on_action();'
	)
	FROM
		information_schema.tables
	WHERE
		table_schema = 'public' AND
		table_name NOT IN ('account', 'login_for_account')
	LOOP
		EXECUTE _sql;
	END LOOP;
END
$$;

CALL check_user_agreement_on_update_all_tables();

-- Triggers for INSERT
CREATE PROCEDURE check_user_agreement_on_insert_all_tables() LANGUAGE  plpgsql AS
$$
DECLARE
	_sql VARCHAR;
BEGIN
	FOR _sql IN SELECT CONCAT (
		'CREATE TRIGGER check_',
		quote_ident(table_name),
		'_before_insert BEFORE INSERT ON ',
		quote_ident(table_name),
		' FOR EACH STATEMENT EXECUTE FUNCTION check_user_agreement_on_action();'
	)
	FROM
		information_schema.tables
	WHERE
		table_schema = 'public' AND
		table_name NOT IN ('account', 'login_for_account')
	LOOP
		EXECUTE _sql;
	END LOOP;
END
$$;

CALL check_user_agreement_on_insert_all_tables();

-- Checks whether the user agreed to the RSD terms and pricacy statement
CREATE FUNCTION check_user_agreement_on_delete_action() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	IF
		CURRENT_USER <> 'rsd_admin' AND NOT
		(SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) AND
		(SELECT * FROM user_agreements_stored(uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'))) = FALSE
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You need to agree to our Terms of Service and the Privacy Statement before proceeding. Please open your user profile settings to agree.';
	ELSE
		RETURN OLD;
	END IF;
END
$$;

-- Triggers for DELETE
CREATE PROCEDURE check_user_agreement_on_delete_all_tables() LANGUAGE  plpgsql AS
$$
DECLARE
	_sql VARCHAR;
BEGIN
	FOR _sql IN SELECT CONCAT (
		'CREATE TRIGGER check_',
		quote_ident(table_name),
		'_before_delete BEFORE DELETE ON ',
		quote_ident(table_name),
		' FOR EACH STATEMENT EXECUTE FUNCTION check_user_agreement_on_delete_action();'
	)
	FROM
		information_schema.tables
	WHERE
		table_schema = 'public' AND
		table_name NOT IN ('account', 'login_for_account')
	LOOP
		EXECUTE _sql;
	END LOOP;
END
$$;

CALL check_user_agreement_on_delete_all_tables();
