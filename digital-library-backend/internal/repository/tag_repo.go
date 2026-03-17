package repository

type TagRepository struct {
	db DBTX
}

func NewTagRepository(db DBTX) *TagRepository {
	return &TagRepository{db: db}
}

func (r *TagRepository) SyncPostTags(postID int, tagNames []string) error {

	_, err := r.db.Exec("DELETE FROM post_tags WHERE post_id = $1", postID)
	if err != nil {
		return err
	}

	for _, name := range tagNames {
		var tagID int

		err := r.db.QueryRow(`
            INSERT INTO tags (name) VALUES ($1) 
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
            RETURNING id`, name).Scan(&tagID)
		if err != nil {
			return err
		}

		_, err = r.db.Exec("INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)", postID, tagID)
		if err != nil {
			return err
		}
	}
	return nil
}
