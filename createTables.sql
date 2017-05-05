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

DROP TABLE IF EXISTS payments;
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT NOT NULL,
    payment_time DATE,
    amount DOUBLE,
    -- login username, account username
    from_username VARCHAR(40),
    -- current memeber name
    from_name VARCHAR(40),
    to_username VARCHAR(40),
    status VARCHAR(20) NOT NULL,
    PRIMARY KEY(payment_id)
);

