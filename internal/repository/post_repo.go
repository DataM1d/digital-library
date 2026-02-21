package repository

import (
	"database/sql"

	"github.com/DataM1d/digital-library/internal/models"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

func (r *PostRepository) GetAll() ([]models.Post, error) {
	rows, err := r.db.Query("SELECT id, title, description, created_at FROM posts")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.CreatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}
