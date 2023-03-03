-- SPDX-FileCopyrightText: 2021 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 - 2023 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- maintainer tables
ALTER TABLE maintainer_for_software ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION software_of_current_maintainer() RETURNS SETOF UUID STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT software FROM maintainer_for_software WHERE maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	RETURN;
END
$$;

CREATE FUNCTION related_software() RETURNS SETOF UUID STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT software FROM software_for_organisation WHERE organisation IN (SELECT * FROM organisations_of_current_maintainer());
	RETURN QUERY SELECT software FROM software_for_project WHERE project IN (SELECT * FROM projects_of_current_maintainer());
	RETURN;
END
$$;

CREATE POLICY maintainer_select ON maintainer_for_software FOR SELECT TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY maintainer_delete ON maintainer_for_software FOR DELETE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY maintainer_insert ON maintainer_for_software FOR INSERT TO rsd_user
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON maintainer_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE maintainer_for_project ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION projects_of_current_maintainer() RETURNS SETOF UUID STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT project FROM maintainer_for_project WHERE maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	RETURN;
END
$$;

CREATE FUNCTION related_projects() RETURNS SETOF UUID STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT project FROM project_for_organisation WHERE organisation IN (SELECT * FROM organisations_of_current_maintainer());
	RETURN QUERY SELECT project FROM software_for_project WHERE software IN (SELECT * FROM software_of_current_maintainer());
	RETURN;
END
$$;

CREATE POLICY maintainer_select ON maintainer_for_project FOR SELECT TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_delete ON maintainer_for_project FOR DELETE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_insert ON maintainer_for_project FOR INSERT TO rsd_user
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON maintainer_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE maintainer_for_organisation ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION organisations_of_current_maintainer() RETURNS SETOF UUID STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT id FROM organisation WHERE primary_maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	RETURN QUERY SELECT organisation FROM maintainer_for_organisation WHERE maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	RETURN;
END
$$;

CREATE POLICY maintainer_select ON maintainer_for_organisation FOR SELECT TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_delete ON maintainer_for_organisation FOR DELETE TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_insert ON maintainer_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY admin_all_rights ON maintainer_for_organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- invitations PROJECT
ALTER TABLE invite_maintainer_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_select ON invite_maintainer_for_project FOR SELECT TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_delete ON invite_maintainer_for_project FOR DELETE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_insert ON invite_maintainer_for_project FOR INSERT TO rsd_user
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()) AND created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY admin_all_rights ON invite_maintainer_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);

-- invitations SOFTWARE
ALTER TABLE invite_maintainer_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_select ON invite_maintainer_for_software FOR SELECT TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_delete ON invite_maintainer_for_software FOR DELETE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_insert ON invite_maintainer_for_software FOR INSERT TO rsd_user
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()) AND created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY admin_all_rights ON invite_maintainer_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);

-- invitations ORGANISATION
ALTER TABLE invite_maintainer_for_organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_select ON invite_maintainer_for_organisation FOR SELECT TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_delete ON invite_maintainer_for_organisation FOR DELETE TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_insert ON invite_maintainer_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY admin_all_rights ON invite_maintainer_for_organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- image
ALTER TABLE image ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON image FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY rsd_user_all_rights ON image TO rsd_user
	USING (TRUE)
	WITH CHECK (TRUE);

CREATE POLICY admin_all_rights ON image TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- software
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software FOR SELECT TO rsd_web_anon, rsd_user
	USING (is_published);

CREATE POLICY maintainer_select_related ON software FOR SELECT TO rsd_user
	USING (id IN (SELECT * FROM related_software()));

CREATE POLICY maintainer_all_rights ON software TO rsd_user
	USING (id IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (TRUE);

CREATE FUNCTION insert_maintainer_new_software() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	IF (SELECT current_setting('request.jwt.claims', TRUE)::json->>'account' IS NULL) THEN RETURN NULL;
	END IF;
	INSERT INTO maintainer_for_software VALUES (uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'), NEW.id);
	RETURN NULL;
END
$$;

CREATE TRIGGER insert_maintainer_new_software AFTER INSERT ON software FOR EACH ROW EXECUTE PROCEDURE insert_maintainer_new_software();

CREATE POLICY admin_all_rights ON software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- software relations
ALTER TABLE repository_url ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON repository_url FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON repository_url TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON repository_url TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE license_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON license_for_software FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON license_for_software TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON license_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE contributor ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON contributor FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON contributor TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON contributor TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE testimonial ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON testimonial FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON testimonial TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON testimonial TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);

-- keywords
ALTER TABLE keyword ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON keyword FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY maintainer_can_insert ON keyword FOR INSERT TO rsd_user
	WITH CHECK (TRUE);

CREATE POLICY maintainer_can_delete ON keyword FOR DELETE TO rsd_user
	USING (TRUE);

CREATE POLICY admin_all_rights ON keyword TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- keywords for software
ALTER TABLE keyword_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON keyword_for_software FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON keyword_for_software TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON keyword_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- projects
ALTER TABLE project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project FOR SELECT TO rsd_web_anon, rsd_user
	USING (is_published);

CREATE POLICY maintainer_select_related ON project FOR SELECT TO rsd_user
	USING (id IN (SELECT * FROM related_projects()));

CREATE POLICY maintainer_all_rights ON project TO rsd_user
	USING (id IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (TRUE);

CREATE FUNCTION insert_maintainer_new_project() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	IF (SELECT current_setting('request.jwt.claims', TRUE)::json->>'account' IS NULL) THEN RETURN NULL;
	END IF;
	INSERT INTO maintainer_for_project VALUES (uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'), NEW.id);
	RETURN NULL;
END
$$;

CREATE TRIGGER insert_maintainer_new_project AFTER INSERT ON project FOR EACH ROW EXECUTE PROCEDURE insert_maintainer_new_project();

CREATE POLICY admin_all_rights ON project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE url_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON url_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON url_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON url_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);

-- project relations
ALTER TABLE team_member ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON team_member FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON team_member TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON team_member TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- research domain
ALTER TABLE research_domain ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON research_domain FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY admin_all_rights ON research_domain TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- keywords and research domains for projects
ALTER TABLE keyword_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON keyword_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON keyword_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON keyword_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE research_domain_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON research_domain_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON research_domain_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON research_domain_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- mentions
-- TODO: not sure what to do here,
-- should a mention only be visible if you can see at least one software or project for which it relates?
ALTER TABLE mention ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON mention FOR SELECT TO rsd_web_anon, rsd_user
	USING (id IN (SELECT mention FROM mention_for_software)
		OR id IN (SELECT mention FROM output_for_project)
		OR id IN (SELECT mention FROM impact_for_project)
		OR id IN (SELECT mention_id FROM release_version));

CREATE POLICY maintainer_can_read ON mention FOR SELECT TO rsd_user
	USING (TRUE);

CREATE POLICY maintainer_can_delete ON mention FOR DELETE TO rsd_user
	USING (TRUE);

CREATE POLICY maintainer_can_insert ON mention FOR INSERT TO rsd_user
	WITH CHECK (TRUE);

CREATE POLICY admin_all_rights ON mention TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE mention_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON mention_for_software FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON mention_for_software TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON mention_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE output_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON output_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON output_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON output_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE impact_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON impact_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON impact_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON impact_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- releases
ALTER TABLE release ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON release FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_select ON release FOR SELECT TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON release TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE release_version ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON release_version FOR SELECT TO rsd_web_anon, rsd_user
	USING (release_id IN (SELECT software FROM release));

CREATE POLICY maintainer_select ON release_version FOR SELECT TO rsd_user
	USING (release_id IN (SELECT software FROM release));

CREATE POLICY admin_all_rights ON release_version TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- accounts
ALTER TABLE account ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_all_rights ON account TO rsd_user
	USING (id = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'))
	WITH CHECK (id = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY admin_all_rights ON account TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE login_for_account ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_all_rights ON login_for_account TO rsd_user
	USING (account IN (SELECT id FROM account))
	WITH CHECK (account IN (SELECT id FROM account));

CREATE POLICY admin_all_rights ON login_for_account TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE orcid_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_all_rights ON orcid_whitelist TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- organisation
ALTER TABLE organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON organisation FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY maintainer_can_update ON organisation FOR UPDATE TO rsd_user
	USING (id IN (SELECT * FROM organisations_of_current_maintainer()))
	WITH CHECK (id IN (SELECT * FROM organisations_of_current_maintainer()));

-- see the trigger sanitise_insert_organisation
CREATE POLICY maintainer_can_insert ON organisation FOR INSERT TO rsd_user
	WITH CHECK (TRUE);

CREATE POLICY admin_all_rights ON organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);

-- inter relations
ALTER TABLE software_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_software FOR SELECT TO rsd_web_anon, rsd_user
	USING (origin IN (SELECT id FROM software) AND relation IN (SELECT id FROM software));

CREATE POLICY maintainer_origin_can_read ON software_for_software FOR SELECT TO rsd_user
	USING (origin IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY maintainer_origin_insert ON software_for_software FOR INSERT TO rsd_user
	WITH CHECK (origin IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY maintainer_origin_delete ON software_for_software FOR DELETE TO rsd_user
	USING (origin IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON software_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE software_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software) AND project IN (SELECT id FROM project));

CREATE POLICY maintainer_can_read ON software_for_project FOR SELECT TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) OR project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_insert ON software_for_project FOR INSERT TO rsd_user
	WITH CHECK (status = 'approved' AND (software IN (SELECT * FROM software_of_current_maintainer()) OR project IN (SELECT * FROM projects_of_current_maintainer())));

CREATE POLICY maintainer_update ON software_for_project FOR UPDATE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) OR project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_delete ON software_for_project FOR DELETE TO rsd_user
	USING (status = 'approved' AND (software IN (SELECT * FROM software_of_current_maintainer()) OR project IN (SELECT * FROM projects_of_current_maintainer())));

CREATE POLICY admin_all_rights ON software_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE project_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project_for_project FOR SELECT TO rsd_web_anon, rsd_user
	USING (origin IN (SELECT id FROM project) AND relation IN (SELECT id FROM project));

CREATE POLICY maintainer_can_read ON project_for_project FOR SELECT TO rsd_user
	USING (origin IN (SELECT * FROM projects_of_current_maintainer()) OR relation IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_insert ON project_for_project FOR INSERT TO rsd_user
	WITH CHECK (status = 'approved' AND (origin IN (SELECT * FROM projects_of_current_maintainer()) OR relation IN (SELECT * FROM organisations_of_current_maintainer())));

CREATE POLICY maintainer_update ON project_for_project FOR UPDATE TO rsd_user
	USING (origin IN (SELECT * FROM projects_of_current_maintainer()) OR relation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_delete ON project_for_project FOR DELETE TO rsd_user
	USING (status = 'approved' AND (origin IN (SELECT * FROM projects_of_current_maintainer()) OR relation IN (SELECT * FROM organisations_of_current_maintainer())));

CREATE POLICY admin_all_rights ON project_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE software_for_organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_organisation FOR SELECT TO rsd_web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_can_read ON software_for_organisation FOR SELECT TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_insert ON software_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (status = 'approved' AND ((NOT is_featured AND software IN (SELECT * FROM software_of_current_maintainer())) OR organisation IN (SELECT * FROM organisations_of_current_maintainer())));

CREATE POLICY maintainer_update ON software_for_organisation FOR UPDATE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) OR organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_delete ON software_for_organisation FOR DELETE TO rsd_user
	USING (status = 'approved' AND (software IN (SELECT * FROM software_of_current_maintainer()) OR organisation IN (SELECT * FROM organisations_of_current_maintainer())));

CREATE POLICY admin_all_rights ON software_for_organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE project_for_organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project_for_organisation FOR SELECT TO rsd_web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_can_read ON project_for_organisation FOR SELECT TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_insert ON project_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (status = 'approved' AND ((NOT is_featured AND project IN (SELECT * FROM projects_of_current_maintainer())) OR organisation IN (SELECT * FROM organisations_of_current_maintainer())));

CREATE POLICY maintainer_update ON project_for_organisation FOR UPDATE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()) OR organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY maintainer_delete ON project_for_organisation FOR DELETE TO rsd_user
	USING (status = 'approved' AND (project IN (SELECT * FROM projects_of_current_maintainer()) OR organisation IN (SELECT * FROM organisations_of_current_maintainer())));

CREATE POLICY admin_all_rights ON project_for_organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- meta-pages
ALTER TABLE meta_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON meta_pages FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY admin_all_rights ON meta_pages TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- oaipmh
ALTER TABLE oaipmh ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON oaipmh FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY admin_all_rights ON oaipmh TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
