DELIMITER //

DROP PROCEDURE IF EXISTS UploadAudio // 

CREATE PROCEDURE UploadAudio(
    IN p_user_id VARCHAR(25),
    IN p_title VARCHAR(255),
    IN p_audio_file VARCHAR(255),
    IN p_parent_audio_id BIGINT UNSIGNED,
    IN p_like_count INT
) 
BEGIN
    -- Insert the data into the audio_files table
    INSERT INTO audio_files (user_id, parent_audio_id, title, audio_file, like_count, created_at) 
    VALUES (p_user_id, p_parent_audio_id, p_title, p_audio_file, p_like_count, CURRENT_TIMESTAMP);
END //

DELIMITER ;
