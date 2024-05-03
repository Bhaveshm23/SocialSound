DELIMITER //

DROP PROCEDURE IF EXISTS DeleteAudio // 

CREATE PROCEDURE DeleteAudio(IN p_audio_id BIGINT UNSIGNED)
BEGIN
    -- Delete reply audios first
    DELETE FROM audio_files WHERE parent_audio_id = p_audio_id;
    
    -- Then delete the parent audio
    DELETE FROM audio_files WHERE audio_id = p_audio_id AND parent_audio_id IS NULL;
END //

DELIMITER ;
