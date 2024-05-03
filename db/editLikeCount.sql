DELIMITER //
DROP PROCEDURE IF EXISTS EditLikeCount //
CREATE PROCEDURE EditLikeCount(IN p_audio_id BIGINT UNSIGNED, IN p_increment BOOLEAN)
BEGIN
    DECLARE current_likes INT;

    SELECT like_count INTO current_likes FROM audio_files WHERE audio_id = p_audio_id;

    IF p_increment THEN
        UPDATE audio_files SET like_count = current_likes + 1 WHERE audio_id = p_audio_id;
    ELSE
        UPDATE audio_files SET like_count = GREATEST(current_likes - 1, 0) WHERE audio_id = p_audio_id;
    END IF;
END //
DELIMITER ;
