CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    user_type VARCHAR(20),
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS relationships (
    child_user_id VARCHAR(20) NOT NULL,
    parent_user_id VARCHAR(20) NOT NULL,
    one_time_quota DOUBLE,
    monthly_quota DOUBLE,
    PRIMARY KEY(parent_user_id, child_user_id),
    FOREIGN KEY(child_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(parent_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
