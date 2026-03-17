package service

import (
	"github.com/DataM1d/digital-library/internal/domain"
	"github.com/DataM1d/digital-library/internal/models"
	"github.com/DataM1d/digital-library/pkg/utils"
	"github.com/microcosm-cc/bluemonday"
)

type CategoryService interface {
	CreateCategory(name string) (*models.Category, error)
	GetAllCategories() ([]models.Category, error)
	DeleteCategory(id int) error
}

type categoryService struct {
	repo domain.CategoryRepo
}

func NewCategoryService(repo domain.CategoryRepo) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) CreateCategory(name string) (*models.Category, error) {
	p := bluemonday.StrictPolicy()
	cleanName := p.Sanitize(name)

	category := &models.Category{
		Name: cleanName,
		Slug: utils.GenerateSlug(cleanName),
	}
	err := s.repo.Create(category)
	return category, err
}

func (s *categoryService) GetAllCategories() ([]models.Category, error) {
	return s.repo.GetAll()
}

func (s *categoryService) DeleteCategory(id int) error {
	return s.repo.Delete(id)
}
