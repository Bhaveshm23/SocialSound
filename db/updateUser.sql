DELIMITER //

DROP PROCEDURE IF EXISTS UpdateUser // 

CREATE PROCEDURE UpdateUser(IN p_user_id VARCHAR(25), IN p_username VARCHAR(25), IN p_email_address VARCHAR(255), IN p_bio VARCHAR(255), IN p_profile_picture VARCHAR(255))
BEGIN

    UPDATE users SET  username = p_username, email_address = p_email_address, bio = p_bio, profile_picture = p_profile_picture
    WHERE user_id = p_user_id;
    
END //
DELIMITER ;