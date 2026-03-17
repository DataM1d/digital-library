package repository

import (
	"github.com/DataM1d/digital-library/internal/models"
)

type CategoryRepository struct {
	db DBTX
}

func NewCategoryRepository(db DBTX) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) GetAll() ([]models.Category, error) {
	rows, err := r.db.Query("SELECT id, name, slug, created_at FROM categories ORDER BY name ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.CreatedAt); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}
	return categories, nil
}

func (r *CategoryRepository) Create(c *models.Category) error {
	query := `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id`
	return r.db.QueryRow(query, c.Name, c.Slug).Scan(&c.ID)
}

func (r *CategoryRepository) Delete(id int) error {
	_, err := r.db.Exec("DELETE FROM categories WHERE id = $1", id)
	return err
}
