DELIMITER //

DROP PROCEDURE IF EXISTS ListAudioReplies //

CREATE PROCEDURE ListAudioReplies(IN p_audio_id BIGINT UNSIGNED)
BEGIN
    SELECT af.audio_id, af.title, af.audio_file, af.like_count, af.created_at, u.user_id, u.username, u.profile_picture
    FROM audio_files af
    JOIN users u ON af.user_id = u.user_id
    WHERE af.parent_audio_id = p_audio_id ORDER BY created_at ASC;
END //

DELIMITER ;