CREATE TABLE system_users (
  id        serial,
  login     varchar(64) NOT NULL,
  password  varchar(255) NOT NULL,
  full_name  varchar(255)
);

ALTER TABLE system_users ADD CONSTRAINT pkSystemUser PRIMARY KEY (id);

CREATE UNIQUE INDEX akSystemUserLogin ON system_users (login);

CREATE TABLE system_groups (
  id    serial,
  name  varchar(64) NOT NULL
);

ALTER TABLE system_groups ADD CONSTRAINT pkSystemGroup PRIMARY KEY (id);

CREATE UNIQUE INDEX akSystemGroupName ON system_groups (name);

CREATE TABLE group_user (
  group_id  integer NOT NULL,
  user_id   integer NOT NULL
);

ALTER TABLE group_user ADD CONSTRAINT pkGroupUser PRIMARY KEY (group_id, user_id);
ALTER TABLE group_user ADD CONSTRAINT fkGroupUserGroupId FOREIGN KEY (group_id) REFERENCES system_groups (id) ON DELETE CASCADE;
ALTER TABLE group_user ADD CONSTRAINT fkGroupUserUserId FOREIGN KEY (user_id) REFERENCES system_users (id) ON DELETE CASCADE;

CREATE TABLE sessions (
  id      serial,
  user_id  integer NOT NULL,
  token   varchar(64) NOT NULL,
  ip      varchar(45) NOT NULL,
  data    text
);

ALTER TABLE sessions ADD CONSTRAINT pkSession PRIMARY KEY (id);

CREATE UNIQUE INDEX akSession ON sessions (token);

ALTER TABLE sessions ADD CONSTRAINT fkSessionUserId FOREIGN KEY (user_id) REFERENCES system_users (id) ON DELETE CASCADE;

CREATE TABLE Country (
  id    serial,
  name  varchar(64) NOT NULL
);

ALTER TABLE Country ADD CONSTRAINT pkCountry PRIMARY KEY (id);

CREATE UNIQUE INDEX akCountry ON Country (name);

CREATE TABLE City (
  id         serial,
  name       varchar(64) NOT NULL,
  CountryId  integer NOT NULL
);

ALTER TABLE City ADD CONSTRAINT pkCity PRIMARY KEY (id);

CREATE UNIQUE INDEX akCity ON City (name);

ALTER TABLE City ADD CONSTRAINT fkCityCountryId FOREIGN KEY (CountryId) REFERENCES Country (id) ON DELETE CASCADE;
