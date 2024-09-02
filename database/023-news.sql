-- SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
--
-- SPDX-License-Identifier: Apache-2.0

-- NEWS table
CREATE TABLE news (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(200) NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	publication_date DATE NOT NULL,
	title VARCHAR(200) NOT NULL,
	author VARCHAR(200),
	summary VARCHAR(300),
	description VARCHAR(10000),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

-- UNIQUE index on slug and publication date combination
CREATE UNIQUE INDEX unique_news_item ON news (slug,publication_date);

-- SANITISE insert and update
CREATE FUNCTION sanitise_insert_news() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_news BEFORE INSERT ON news FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_news();


CREATE FUNCTION sanitise_update_news() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF NEW.slug IS DISTINCT FROM OLD.slug AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the slug';
	END IF;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_news BEFORE UPDATE ON news FOR EACH ROW EXECUTE PROCEDURE sanitise_update_news();

-- IMAGES FOR NEWS items
CREATE TABLE image_for_news (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	news UUID REFERENCES news (id) NOT NULL,
	image_id VARCHAR(40) REFERENCES image(id) NOT NULL,
	position VARCHAR(25) DEFAULT 'card',
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

-- UNIQUE index on news and image combination
CREATE UNIQUE INDEX unique_news_image ON image_for_news (news,image_id);


-- SANITISE insert and update
CREATE FUNCTION sanitise_insert_image_for_news() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_image_for_news BEFORE INSERT ON image_for_news FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_image_for_news();

CREATE FUNCTION sanitise_update_image_for_news() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_image_for_news BEFORE UPDATE ON image_for_news FOR EACH ROW EXECUTE PROCEDURE sanitise_update_image_for_news();


-- RLS news pages
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read_published ON news FOR SELECT TO rsd_web_anon, rsd_user
	USING (is_published);

CREATE POLICY admin_all_rights ON news TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);

-- RLS image_for_news
ALTER TABLE image_for_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON image_for_news FOR SELECT TO rsd_web_anon, rsd_user
	USING (news IN (SELECT id FROM news));

CREATE POLICY admin_all_rights ON image_for_news TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
