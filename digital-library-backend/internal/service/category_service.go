package service

import (
	"github.com/DataM1d/digital-library/internal/models"
	"github.com/DataM1d/digital-library/internal/repository"
	"github.com/DataM1d/digital-library/pkg/utils"
)

type CategoryService interface {
	CreateCategory(name string) (*models.Category, error)
	GetAllCategories() ([]models.Category, error)
	DeleteCategory(id int) error
}

type categoryService struct {
	repo *repository.CategoryRepository
}

func NewCategoryService(repo *repository.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) CreateCategory(name string) (*models.Category, error) {
	category := &models.Category{
		Name: name,
		Slug: utils.GenerateSlug(name),
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
