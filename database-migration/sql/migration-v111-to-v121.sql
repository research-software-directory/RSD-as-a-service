drop function if exists "public"."projects_by_organisation"();

drop function if exists "public"."related_projects_for_project"();

drop function if exists "public"."related_projects_for_software"();

drop function if exists "public"."software_list"();

drop function if exists "public"."projects_by_maintainer"(maintainer_id uuid);

create table "public"."meta_pages" (
    "id" uuid not null default gen_random_uuid(),
    "slug" character varying(100) not null,
    "title" character varying(100) not null,
    "description" character varying(30000),
    "is_published" boolean not null default false,
    "position" integer,
    "created_at" timestamp with time zone not null,
    "updated_at" timestamp with time zone not null
);


alter table "public"."meta_pages" enable row level security;

CREATE UNIQUE INDEX meta_pages_pkey ON public.meta_pages USING btree (id);

CREATE UNIQUE INDEX meta_pages_slug_key ON public.meta_pages USING btree (slug);

alter table "public"."meta_pages" add constraint "meta_pages_pkey" PRIMARY KEY using index "meta_pages_pkey";

alter table "public"."meta_pages" add constraint "meta_pages_slug_check" CHECK (((slug)::text ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text));

alter table "public"."meta_pages" add constraint "meta_pages_slug_key" UNIQUE using index "meta_pages_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.keyword_filter_for_project()
 RETURNS TABLE(project uuid, keywords citext[])
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		keyword_for_project.project  AS project,
		array_agg(
			keyword.value
			ORDER BY value
		) AS keywords
	FROM
		keyword_for_project
	INNER JOIN
		keyword ON keyword.id = keyword_for_project.keyword
	GROUP BY keyword_for_project.project
;
END
$function$
;

CREATE OR REPLACE FUNCTION public.keyword_filter_for_software()
 RETURNS TABLE(software uuid, keywords citext[])
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
SELECT
	keyword_for_software.software AS software,
	array_agg(
		keyword.value
		ORDER BY value
	) AS keywords
FROM
	keyword_for_software
INNER JOIN
	keyword ON keyword.id = keyword_for_software.keyword
GROUP BY keyword_for_software.software
;
END
$function$
;

CREATE OR REPLACE FUNCTION public.project_search()
 RETURNS TABLE(id uuid, slug character varying, title character varying, subtitle character varying, current_state character varying, date_start date, updated_at timestamp with time zone, is_published boolean, image_id uuid, keywords citext[])
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_end IS NULL THEN 'Starting'::varchar
			WHEN project.date_end < now()  THEN 'Finished'::varchar
			ELSE 'Running'::varchar
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		image_for_project.project AS image_id,
		keyword_filter_for_project.keywords
	FROM
		project
	LEFT JOIN
		image_for_project ON project.id = image_for_project.project
	LEFT JOIN
		keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
	;
END
$function$
;

CREATE OR REPLACE FUNCTION public.projects_by_organisation(organisation_id uuid)
 RETURNS TABLE(id uuid, slug character varying, title character varying, subtitle character varying, current_state character varying, date_start date, updated_at timestamp with time zone, is_published boolean, is_featured boolean, image_id uuid, organisation uuid, status relation_status, keywords citext[])
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_end IS NULL THEN 'Starting'::varchar
			WHEN project.date_end < now()  THEN 'Finished'::varchar
			ELSE 'Running'::varchar
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project_for_organisation.is_featured,
		image_for_project.project AS image_id,
		project_for_organisation.organisation,
		project_for_organisation.status,
		keyword_filter_for_project.keywords
	FROM
		project
	LEFT JOIN
		image_for_project ON project.id = image_for_project.project
	LEFT JOIN
		project_for_organisation ON project.id = project_for_organisation.project
	LEFT JOIN
		keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
	WHERE
		project_for_organisation.organisation=organisation_id
	;
END
$function$
;

CREATE OR REPLACE FUNCTION public.related_projects_for_project(origin_id uuid)
 RETURNS TABLE(origin uuid, id uuid, slug character varying, title character varying, subtitle character varying, current_state character varying, date_start date, updated_at timestamp with time zone, is_published boolean, status relation_status, image_id uuid)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		project_for_project.origin,
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_end IS NULL THEN 'Starting'::varchar
			WHEN project.date_end < now()  THEN 'Finished'::varchar
			ELSE 'Running'::varchar
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project_for_project.status,
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON image_for_project.project = project.id
	INNER JOIN
		project_for_project ON project.id = project_for_project.relation
	WHERE
		project_for_project.origin = origin_id
	;
END
$function$
;

CREATE OR REPLACE FUNCTION public.related_projects_for_software(software_id uuid)
 RETURNS TABLE(software uuid, id uuid, slug character varying, title character varying, subtitle character varying, current_state character varying, date_start date, updated_at timestamp with time zone, is_published boolean, status relation_status, image_id uuid)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		software_for_project.software,
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_end IS NULL THEN 'Starting'::varchar
			WHEN project.date_end < now()  THEN 'Finished'::varchar
			ELSE 'Running'::varchar
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		software_for_project.status,
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON image_for_project.project = project.id
	INNER JOIN
		software_for_project ON project.id = software_for_project.project
	WHERE
		software_for_project.software = software_id
	;
END
$function$
;

CREATE OR REPLACE FUNCTION public.sanitise_insert_meta_pages()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION public.sanitise_update_meta_pages()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF NEW.slug IS DISTINCT FROM OLD.slug AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (
		SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER
	) IS DISTINCT FROM TRUE
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the slug';
	END IF;

	return NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION public.software_search()
 RETURNS TABLE(id uuid, slug character varying, brand_name character varying, short_statement character varying, updated_at timestamp with time zone, contributor_cnt bigint, mention_cnt bigint, is_published boolean, keywords citext[])
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.updated_at,
		count_software_countributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.is_published,
		keyword_filter_for_software.keywords
	FROM
		software
	LEFT JOIN
		count_software_countributors() ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	LEFT JOIN
		keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
	;
END
$function$
;

CREATE OR REPLACE FUNCTION public.projects_by_maintainer(maintainer_id uuid)
 RETURNS TABLE(id uuid, slug character varying, title character varying, subtitle character varying, current_state character varying, date_start date, updated_at timestamp with time zone, is_published boolean, image_id uuid)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_end IS NULL THEN 'Starting'::varchar
			WHEN project.date_end < now()  THEN 'Finished'::varchar
			ELSE 'Running'::varchar
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON project.id = image_for_project.project
	INNER JOIN
		maintainer_for_project ON project.id = maintainer_for_project.project
	WHERE
		maintainer_for_project.maintainer = maintainer_id;
END
$function$
;

create policy "admin_all_rights"
on "public"."meta_pages"
as permissive
for all
to rsd_admin
using (true)
with check true;


create policy "anyone_can_read"
on "public"."meta_pages"
as permissive
for select
to web_anon, rsd_user
using (true);


CREATE TRIGGER sanitise_insert_meta_pages BEFORE INSERT ON public.meta_pages FOR EACH ROW EXECUTE FUNCTION sanitise_insert_meta_pages();

CREATE TRIGGER sanitise_update_meta_pages BEFORE UPDATE ON public.meta_pages FOR EACH ROW EXECUTE FUNCTION sanitise_update_meta_pages();


