CREATE TABLE IF NOT EXISTS players (
    username TEXT NOT NULL,
    tag TEXT NOT NULL,
    token_id TEXT NOT NULL UNIQUE,
    PRIMARY KEY (username, tag),
);