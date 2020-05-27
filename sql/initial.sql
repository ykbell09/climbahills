CREATE TABLE users (
    id serial PRIMARY KEY,
    username varchar(30) UNIQUE NOT NULL,
    email varchar(30) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL,
    date_joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    permission varchar NOT NULL DEFAULT 'guest'
);

-- permission is guest, setter, member, admin, requested setter or requested member

CREATE TABLE problems (
    id serial PRIMARY KEY,
    name varchar UNIQUE,
    date_set date NOT NULL,
    fa varchar(30),
    date_entered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes text,
    grade integer NOT NULL,
    removed date,
    setter_id integer NOT NULL,
    FOREIGN KEY (setter_id)
    REFERENCES users (id)
);

-- CREATE TABLE reviews (
--     id serial PRIMARY KEY,
--     date_entered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     stars integer NOT NULL,
--     review text NOT NULL,
--     problemid integer NOT NULL,
--     userid integer NOT NULL,
--     FOREIGN KEY (problemid)
--     REFERENCES problems (id),
--     FOREIGN KEY (userid)
--     REFERENCES users (id)
-- );