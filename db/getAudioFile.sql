DELIMITER // 

DROP PROCEDURE IF EXISTS GetAudioFile // 

CREATE PROCEDURE GetAudioFile(IN p_audio_id BIGINT UNSIGNED)
BEGIN
    SELECT * 
    FROM audio_files
    WHERE audio_id = p_audio_id;
END//

DELIMITER ;
