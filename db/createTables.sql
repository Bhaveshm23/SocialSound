DROP TABLE IF EXISTS audio_files;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id VARCHAR(25) PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    bio VARCHAR(255),
    profile_picture VARCHAR(255) -- stores profile pictur path
);

CREATE TABLE audio_files (
    audio_id SERIAL PRIMARY KEY,
    user_id VARCHAR(25) NOT NULL,
    parent_audio_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    audio_file VARCHAR(255),
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_audio_id) REFERENCES audio_files(audio_id) ON DELETE CASCADE
);