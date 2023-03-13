-- SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE category_type AS ENUM (
	'show_all',
	'dropdown'
);

CREATE TABLE category (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	name VARCHAR DEFAULT "" NOT NULL,
	is_auto_suggested BOOLEAN DEFAULT TRUE NOT NULL,
	-- Do not implement this now, maybe later
	-- allow_multiple_selection BOOLEAN DEFAULT TRUE NOT NULL,
	is_enabled BOOLEAN DEFAULT FALSE NOT NULL,
	for_software BOOLEAN DEFAULT TRUE NOT NULL,
	for_projects BOOLEAN DEFAULT FALSE NOT NULL,
	type category_type DEFAULT 'show_all' NOT NULL
);

CREATE TABLE category_option (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	category VARCHAR references category (id) NOT NULL,
	option VARCHAR NOT NULL,
	color VARCHAR(7) CHECK (color IS NULL OR color ~* '^#[a-f0-9]{6}$'),
	UNIQUE(category, option)
);

-- Relations for software
CREATE TABLE category_option_for_software (
	software UUID references software (id) NOT NULL,
	option UUID references category_option (id) NOT NULL,
	UNIQUE(software, option),
	PRIMARY KEY (software, option)
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_category_option_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_category_option_for_software BEFORE INSERT ON category_option_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_category_option_for_software();

CREATE FUNCTION sanitise_update_category_option_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_category_option_for_software BEFORE UPDATE ON category_option_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_category_option_for_software();

-- Relations for projects
CREATE TABLE category_option_for_project (
	software UUID references software (id) NOT NULL,
	option UUID references category_option (id) NOT NULL,
	UNIQUE(software, option),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_category_option_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_category_option_for_project BEFORE INSERT ON category_option_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_category_option_for_project();

CREATE FUNCTION sanitise_update_category_option_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_category_option_for_project BEFORE UPDATE ON category_option_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_category_option_for_project();
