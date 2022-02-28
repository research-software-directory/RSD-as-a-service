-- maintainer tables
ALTER TABLE maintainer_for_software ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION software_of_current_maintainer() RETURNS SETOF UUID STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT software FROM maintainer_for_software WHERE maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
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

CREATE POLICY maintainer_select ON maintainer_for_project FOR SELECT TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_delete ON maintainer_for_project FOR DELETE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_insert ON maintainer_for_project FOR INSERT TO rsd_user
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON maintainer_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- software
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software FOR SELECT TO web_anon, rsd_user
	USING (is_published);

CREATE POLICY maintainer_all_rights ON software TO rsd_user
	USING (id IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (TRUE);

CREATE FUNCTION insert_maintainer_new_software() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	IF (SELECT current_setting('request.jwt.claims', FALSE)::json->>'account' IS NULL) THEN RETURN NULL;
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

CREATE POLICY anyone_can_read ON repository_url FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON repository_url TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON repository_url TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE license_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON license_for_software FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON license_for_software TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON license_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE contributor ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON contributor FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON contributor TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON contributor TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- tags for software
ALTER TABLE tag_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON tag_for_software FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON tag_for_software TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON tag_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- projects
ALTER TABLE project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project FOR SELECT TO web_anon, rsd_user
	USING (is_published);

CREATE POLICY maintainer_all_rights ON project TO rsd_user
	USING (id IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (TRUE);

CREATE FUNCTION insert_maintainer_new_project() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	IF (SELECT current_setting('request.jwt.claims', FALSE)::json->>'account' IS NULL) THEN RETURN NULL;
	END IF;
	INSERT INTO maintainer_for_project VALUES (uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'), NEW.id);
	RETURN NULL;
END
$$;

CREATE TRIGGER insert_maintainer_new_project AFTER INSERT ON project FOR EACH ROW EXECUTE PROCEDURE insert_maintainer_new_project();

CREATE POLICY admin_all_rights ON project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE image_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON image_for_project FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON image_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON image_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- project relations
ALTER TABLE team_member ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON team_member FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON team_member TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON team_member TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- topics and tags for projects
ALTER TABLE topic_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON topic_for_project FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON topic_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON topic_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE tag_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON tag_for_project FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON tag_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON tag_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- mentions
-- TODO: not sure what to do here,
-- should a mention only be visible if you can see at least one software or project for which it relates?
ALTER TABLE mention ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON mention FOR SELECT TO web_anon, rsd_user
	USING (id IN (SELECT mention FROM mention_for_software) OR id IN (SELECT mention FROM output_for_project) OR id IN (SELECT mention FROM impact_for_project));

CREATE POLICY maintainer_all_rights ON mention TO rsd_user
	USING (TRUE)
	WITH CHECK (TRUE);

CREATE POLICY admin_all_rights ON mention TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE mention_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON mention_for_software FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON mention_for_software TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON mention_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE output_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON output_for_project FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON output_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON output_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE impact_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON impact_for_project FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_all_rights ON impact_for_project TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()))
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON impact_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- releases
ALTER TABLE release ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON release FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_all_rights ON release TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()))
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON release TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE release_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON release_content FOR SELECT TO web_anon, rsd_user
	USING (release_id IN (SELECT id FROM release));

CREATE POLICY maintainer_all_rights ON release_content TO rsd_user
	USING (release_id IN (SELECT id FROM release WHERE software IN (SELECT * FROM software_of_current_maintainer())))
	WITH CHECK (release_id IN (SELECT id FROM release WHERE software IN (SELECT * FROM software_of_current_maintainer())));

CREATE POLICY admin_all_rights ON release_content TO rsd_admin
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


-- organisation
ALTER TABLE organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON organisation FOR SELECT TO web_anon, rsd_user
	USING (TRUE);

CREATE POLICY maintainer_can_update ON organisation FOR UPDATE TO rsd_user
	USING (primary_maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'))
	WITH CHECK (primary_maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY admin_all_rights ON organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


CREATE FUNCTION organisations_of_current_maintainer() RETURNS SETOF UUID LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	RETURN QUERY SELECT id FROM organisation WHERE primary_maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	RETURN;
END
$$;

-- inter relations
ALTER TABLE software_for_software ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_software FOR SELECT TO web_anon, rsd_user
	USING (origin IN (SELECT id FROM software) AND relation IN (SELECT id FROM software));

CREATE POLICY maintainer_origin_can_read ON software_for_software FOR SELECT TO rsd_user
	USING (origin IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY maintainer_origin_insert ON software_for_software FOR INSERT TO rsd_user
	WITH CHECK (origin IN (SELECT * FROM software_of_current_maintainer()) AND relation IN (SELECT id FROM software));

CREATE POLICY maintainer_origin_delete ON software_for_software FOR DELETE TO rsd_user
	USING (origin IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY admin_all_rights ON software_for_software TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE software_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_project FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software) AND project IN (SELECT id FROM project));

CREATE POLICY maintainer_can_read ON software_for_project FOR SELECT TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) OR project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_origin_insert ON software_for_project FOR INSERT TO rsd_user
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()) AND status = 'requested_by_origin');

CREATE POLICY maintainer_relation_insert ON software_for_project FOR INSERT TO rsd_user
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_relation');

CREATE POLICY maintainer_both_insert ON software_for_project FOR INSERT TO rsd_user
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()) AND project IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'approved');

CREATE POLICY maintainer_relation_upgrade_status ON software_for_project FOR UPDATE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_origin')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_origin_upgrade_status ON software_for_project FOR UPDATE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) AND status = 'requested_by_relation')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_delete ON software_for_project FOR DELETE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) OR project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON software_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE project_for_project ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project_for_project FOR SELECT TO web_anon, rsd_user
	USING (origin IN (SELECT id FROM project) AND relation IN (SELECT id FROM project));

CREATE POLICY maintainer_can_read ON project_for_project FOR SELECT TO rsd_user
	USING (origin IN (SELECT * FROM projects_of_current_maintainer()) OR relation IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_origin_insert ON project_for_project FOR INSERT TO rsd_user
	WITH CHECK (origin IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_origin');

CREATE POLICY maintainer_relation_insert ON project_for_project FOR INSERT TO rsd_user
	WITH CHECK (relation IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_relation');

CREATE POLICY maintainer_both_insert ON project_for_project FOR INSERT TO rsd_user
	WITH CHECK (origin IN (SELECT * FROM projects_of_current_maintainer()) AND relation IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'approved');

CREATE POLICY maintainer_relation_upgrade_status ON project_for_project FOR UPDATE TO rsd_user
	USING (relation IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_origin')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_origin_upgrade_status ON project_for_project FOR UPDATE TO rsd_user
	USING (origin IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_relation')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_delete ON project_for_project FOR DELETE TO rsd_user
	USING (origin IN (SELECT * FROM projects_of_current_maintainer()) OR relation IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY admin_all_rights ON project_for_project TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE software_for_organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON software_for_organisation FOR SELECT TO web_anon, rsd_user
	USING (software IN (SELECT id FROM software));

CREATE POLICY maintainer_can_read ON software_for_organisation FOR SELECT TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()));

CREATE POLICY maintainer_origin_insert ON software_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()) AND status = 'requested_by_origin');

CREATE POLICY maintainer_relation_insert ON software_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND status = 'requested_by_relation');

CREATE POLICY maintainer_both_insert ON software_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (software IN (SELECT * FROM software_of_current_maintainer()) AND organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND status = 'approved');

CREATE POLICY maintainer_relation_upgrade_status ON software_for_organisation FOR UPDATE TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND status = 'requested_by_origin')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_origin_upgrade_status ON software_for_organisation FOR UPDATE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) AND status = 'requested_by_relation')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_delete ON software_for_organisation FOR DELETE TO rsd_user
	USING (software IN (SELECT * FROM software_of_current_maintainer()) OR organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY admin_all_rights ON software_for_organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


ALTER TABLE project_for_organisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON project_for_organisation FOR SELECT TO web_anon, rsd_user
	USING (project IN (SELECT id FROM project));

CREATE POLICY maintainer_can_read ON project_for_organisation FOR SELECT TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()));

CREATE POLICY maintainer_origin_insert ON project_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_origin');

CREATE POLICY maintainer_relation_insert ON project_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND status = 'requested_by_relation');

CREATE POLICY maintainer_both_insert ON project_for_organisation FOR INSERT TO rsd_user
	WITH CHECK (project IN (SELECT * FROM projects_of_current_maintainer()) AND organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND status = 'approved');

CREATE POLICY maintainer_relation_upgrade_status ON project_for_organisation FOR UPDATE TO rsd_user
	USING (organisation IN (SELECT * FROM organisations_of_current_maintainer()) AND status = 'requested_by_origin')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_origin_upgrade_status ON project_for_organisation FOR UPDATE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()) AND status = 'requested_by_relation')
	WITH CHECK (status = 'approved');

CREATE POLICY maintainer_delete ON project_for_organisation FOR DELETE TO rsd_user
	USING (project IN (SELECT * FROM projects_of_current_maintainer()) OR organisation IN (SELECT * FROM organisations_of_current_maintainer()));

CREATE POLICY admin_all_rights ON project_for_organisation TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
