package repository

import (
	"database/sql"
	"fmt"

	"github.com/DataM1d/digital-library/internal/models"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) Create(p *models.Post) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `INSERT INTO posts (title, content, category_id) VALUES ($1, $2, $3) RETURNING id`
	err = tx.QueryRow(query, p.Title, p.Content, p.CategoryID).Scan(&p.ID)
	if err != nil {
		return err
	}

	for _, tagName := range p.Tags {
		var tagID int
		err := tx.QueryRow("INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id", tagName).Scan(&tagID)
		if err != nil {
			return err
		}
		_, err = tx.Exec("INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)", p.ID, tagID)
		if err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (r *PostRepository) GetAll(category string, search string, limit, offset int) ([]models.Post, error) {
	query := `
    SELECT p.id, p.title, p.content, p.category_id, c.name, 
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1`

	var args []interface{}
	argCount := 1

	if category != "" {
		query += fmt.Sprintf(" AND c.slug = $%d", argCount)
		args = append(args, category)
		argCount++
	}

	if search != "" {
		query += fmt.Sprintf(" AND (p.title ILIKE $%d OR p.content ILIKE $%d)", argCount, argCount)
		args = append(args, "%"+search+"%")
		argCount++
	}

	query += fmt.Sprintf(" ORDER BY p.created_at DESC LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, limit, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		var p models.Post
		var categoryName sql.NullString
		var categoryID sql.NullInt64
		var content sql.NullString

		err := rows.Scan(&p.ID, &p.Title, &content, &categoryID, &categoryName, &p.LikeCount)
		if err != nil {
			return nil, err
		}

		p.Content = content.String
		p.CategoryID = int(categoryID.Int64)
		p.CategoryName = categoryName.String

		tagQuery := `SELECT t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = $1`
		tagRows, err := r.db.Query(tagQuery, p.ID)
		if err == nil {
			for tagRows.Next() {
				var tagName string
				tagRows.Scan(&tagName)
				p.Tags = append(p.Tags, tagName)
			}
			tagRows.Close()
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func (r *PostRepository) ToggleLike(userID, postID int) (bool, error) {
	var exists bool
	err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2)", userID, postID).Scan(&exists)
	if err != nil {
		return false, err
	}

	if exists {
		_, err = r.db.Exec("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", userID, postID)
		return false, err
	} else {
		_, err = r.db.Exec("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", userID, postID)
		return true, err
	}
}
