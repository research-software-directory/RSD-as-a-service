-- software
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software FOR SELECT TO web_anon
	USING (is_published);

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
