-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- REMOTE_RSD
-- Table for remote rsd to scrape
CREATE TABLE remote_rsd (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	label VARCHAR (50) NOT NULL UNIQUE CHECK (LENGTH(label) >= 3),
	domain VARCHAR(200) NOT NULL UNIQUE,
	active BOOLEAN DEFAULT TRUE,
	scrape_interval_minutes BIGINT DEFAULT 5 CHECK (scrape_interval_minutes >= 5),
	scraped_at TIMESTAMPTZ,
	last_err_msg VARCHAR(1000),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

-- SANITIZE REMOTE_RSD
CREATE FUNCTION sanitise_insert_remote_rsd() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_remote_rsd BEFORE INSERT ON remote_rsd
	FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_remote_rsd();

CREATE FUNCTION sanitise_update_remote_rsd() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_remote_rsd BEFORE UPDATE ON remote_rsd
	FOR EACH ROW EXECUTE PROCEDURE sanitise_update_remote_rsd();

-- RLS REMOTE_RSD

ALTER TABLE remote_rsd ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON remote_rsd FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY admin_all_rights ON remote_rsd TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- REMOTE_SOFTWARE
-- Table for scraped remote software
-- Results are returned from software_overview RPC from remote RSD and enriched with remote_rsd id
CREATE TABLE remote_software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	remote_rsd_id UUID NOT NULL REFERENCES remote_rsd(id),
	remote_software_id UUID NOT NULL,
	slug VARCHAR(200) NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	brand_name VARCHAR(200) NOT NULL,
	short_statement VARCHAR(300),
	image_id VARCHAR(40),
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	keywords CITEXT[],
	keywords_text TEXT,
	prog_lang TEXT[],
	licenses VARCHAR[],
	scraped_at TIMESTAMPTZ NOT NULL,
	UNIQUE(remote_rsd_id, remote_software_id)
);

CREATE POLICY anyone_can_read ON remote_software FOR SELECT TO rsd_web_anon, rsd_user
	USING (is_published);

ALTER TABLE remote_software ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_all_rights ON remote_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
