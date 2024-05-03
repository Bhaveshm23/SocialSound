DELIMITER //

DROP PROCEDURE IF EXISTS UpdateAudio // 

CREATE PROCEDURE UpdateAudio(IN p_audio_id BIGINT UNSIGNED, IN p_title VARCHAR(255), IN p_audio_file VARCHAR(255))
BEGIN
    UPDATE audio_files SET title = p_title,
        audio_file = p_audio_file
     WHERE audio_id = p_audio_id;
END //
DELIMITER ;