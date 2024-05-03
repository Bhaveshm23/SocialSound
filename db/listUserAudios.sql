DELIMITER //

DROP PROCEDURE IF EXISTS ListUserAudios // 

CREATE PROCEDURE ListUserAudios(IN p_user_id VARCHAR(25))
BEGIN
    SELECT af.audio_id, af.title, af.audio_file, af.like_count, af.created_at, u.user_id, u.bio, u.username, u.profile_picture
    FROM audio_files af
    JOIN users u ON af.user_id = u.user_id
    WHERE (af.user_id = p_user_id AND parent_audio_id IS NULL) ORDER BY created_at DESC;
END //
DELIMITER ;