ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software FOR SELECT TO web_anon
	USING (is_published);

CREATE POLICY admin_all_rights ON software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


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
