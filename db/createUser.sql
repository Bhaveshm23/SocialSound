DELIMITER //

DROP PROCEDURE IF EXISTS CreateUser //

CREATE PROCEDURE CreateUser(
    IN p_user_id VARCHAR(25),
    IN p_username VARCHAR(25), 
    IN p_email_address VARCHAR(255), 
    IN p_bio VARCHAR(255), 
    IN p_profile_picture VARCHAR(255)
)
BEGIN
    INSERT INTO users (user_id, username, email_address, bio, profile_picture) 
    VALUES (p_user_id, p_username, p_email_address, p_bio, p_profile_picture);
END  //
DELIMITER ;
