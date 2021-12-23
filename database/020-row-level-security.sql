-- software
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software FOR SELECT TO web_anon
	USING (is_published);

CREATE POLICY maintainer_all_rights ON software TO rsd_user
	USING (id IN (SELECT software FROM maintainer_for_software WHERE maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')))
	WITH CHECK (TRUE);

CREATE FUNCTION insert_maintainer_new_software() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	IF (SELECT  current_setting('request.jwt.claims', FALSE)::json->>'account' IS NULL) THEN RETURN NULL;
	END IF;
	INSERT INTO maintainer_for_software VALUES (uuid( uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')), NEW.id);
	RETURN NULL;
END
$$;

CREATE TRIGGER insert_maintainer_new_software AFTER INSERT ON software FOR EACH ROW EXECUTE PROCEDURE insert_maintainer_new_software();

CREATE POLICY admin_all_rights ON software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- software relations
ALTER TABLE repository_url ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON repository_url FOR SELECT TO web_anon
	USING (software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON repository_url TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE license_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON license_for_software FOR SELECT TO web_anon
	USING (software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON license_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE contributor ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON contributor FOR SELECT TO web_anon
	USING (software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON contributor TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE software_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_software FOR SELECT TO web_anon
	USING (origin IN (SELECT id FROM software) AND relation IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON software_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- tags for software
ALTER TABLE tag_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON tag_for_software FOR SELECT TO web_anon
	USING (software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON tag_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- projects
ALTER TABLE project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project FOR SELECT TO web_anon
	USING (is_published);

CREATE POLICY admin_all_rights ON project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE image_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON image_for_project FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project));

CREATE POLICY admin_all_rights ON image_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- project relations
ALTER TABLE software_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_project FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project) AND software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON software_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE project_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project_for_project FOR SELECT TO web_anon
	USING (origin IN (SELECT id FROM project) AND relation IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON project_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE team_member ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON team_member FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project));

CREATE POLICY admin_all_rights ON team_member TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- topics and tags for projects
ALTER TABLE topic_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON topic_for_project FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project));

CREATE POLICY admin_all_rights ON topic_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE tag_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON tag_for_project FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project));

CREATE POLICY admin_all_rights ON tag_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- mentions
-- TODO: not sure what to do here,
-- should a mention only be visible if you can see at least one software or project for which it relates?
ALTER TABLE mention ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON mention FOR SELECT TO web_anon
	USING (id IN (SELECT mention FROM mention_for_software) OR id IN (SELECT mention FROM output_for_project) OR id IN (SELECT mention FROM impact_for_project));

CREATE POLICY admin_all_rights ON mention TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE mention_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON mention_for_software FOR SELECT TO web_anon
	USING (software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON mention_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE output_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON output_for_project FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project));

CREATE POLICY admin_all_rights ON output_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE impact_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON impact_for_project FOR SELECT TO web_anon
	USING (project IN (SELECT id FROM project));

CREATE POLICY admin_all_rights ON impact_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- releases
ALTER TABLE release ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON release FOR SELECT TO web_anon
	USING (software IN (SELECT id FROM software));

CREATE POLICY admin_all_rights ON release TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE release_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON release_content FOR SELECT TO web_anon
	USING (release_id IN (SELECT id FROM release));

CREATE POLICY admin_all_rights ON release_content TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- accounts
ALTER TABLE account ENABLE ROW LEVEL SECURITY;

CREATE POLICY anonymous_cannot_read ON account FOR SELECT TO web_anon
	USING (FALSE);

CREATE POLICY admin_all_rights ON account TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE login_for_account ENABLE ROW LEVEL SECURITY;

CREATE POLICY anonymous_cannot_read ON login_for_account FOR SELECT TO web_anon
	USING (FALSE);

CREATE POLICY admin_all_rights ON login_for_account TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
