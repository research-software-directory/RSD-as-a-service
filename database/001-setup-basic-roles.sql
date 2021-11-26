CREATE ROLE web_anon NOLOGIN;

GRANT USAGE ON SCHEMA public TO web_anon;

--We should later probably restrict this to SELECT only
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO web_anon;

CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'simplepassword';

GRANT web_anon TO authenticator;
