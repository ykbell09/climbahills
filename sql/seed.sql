INSERT INTO users (name, username, email, password)
VALUES 
    ('bob', 'bob1', 'bob@bob.com', 'testpass'),
    ('a', 'a1', 'a@bob.com', 'testpassa'),
    ('c', 'c1', 'c@bob.com', 'testpassc'),
    ('d', 'd1', 'd@bob.com', 'testpassd');

INSERT INTO problems (date_set, name, notes, grade, userid)
VALUES
    ('2020-05-21', 'crimp city', 'very crimpy', 4, 1),
    ('2020-05-21', 'hurley burley', 'burley, but doable', 2, 2),
    ('2020-05-21', 'big beta', 'beta specific, can only send one way!', 2, 3),
    ('2020-05-21', 'easy mcfootface', 'easy peasy, don''t forget the high foot', 1, 1);

