DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_type VARCHAR(20),
    name VARCHAR(40),
    image LONGBLOB,
    one_time_quota DOUBLE,
    monthly_quota DOUBLE,
    -- login username, account username
    username VARCHAR(20) NOT NULL,
    PRIMARY KEY(user_id)
);

