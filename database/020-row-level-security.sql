ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read_software ON software FOR SELECT TO web_anon
	USING (is_published);

CREATE POLICY admin_all_rights_software ON software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
