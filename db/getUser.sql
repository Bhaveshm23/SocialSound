DELIMITER // 

DROP PROCEDURE IF EXISTS GetUser // 

CREATE PROCEDURE GetUser(IN p_user_id VARCHAR(25))
BEGIN
    SELECT * 
    FROM users
    WHERE user_id = p_user_id;
END//

DELIMITER ;
