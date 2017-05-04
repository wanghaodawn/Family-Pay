CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    PRIMARY KEY(username, user_type)
);

CREATE TABLE IF NOT EXISTS relationships (
    child_username VARCHAR(20) NOT NULL,
    parent_username VARCHAR(20) NOT NULL,
    one_time_quota DOUBLE,
    monthly_quota DOUBLE,
    PRIMARY KEY(parent_username, child_username),
    FOREIGN KEY(child_username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY(parent_username) REFERENCES users(username) ON DELETE CASCADE
);
