CREATE TABLE users (
    id serial PRIMARY KEY,
    name varchar(30) NOT NULL,
    username varchar(30) UNIQUE NOT NULL,
    email varchar(30) UNIQUE NOT NULL,
    password VARCHAR(100) UNIQUE NOT NULL,
    date_joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problems (
    id serial PRIMARY KEY,
    date_set date NOT NULL,
    date_entered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes text,
    grade integer NOT NULL,
    userid integer NOT NULL,
    FOREIGN KEY (userid)
    REFERENCES users (id)
);

CREATE TABLE reviews (
    id serial PRIMARY KEY,
    date_entered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stars integer NOT NULL,
    review text NOT NULL,
    problemid integer NOT NULL,
    userid integer NOT NULL,
    FOREIGN KEY (problemid)
    REFERENCES problems (id),
    FOREIGN KEY (userid)
    REFERENCES users (id)
);