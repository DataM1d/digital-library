package service

import (
	"testing"

	"github.com/DataM1d/digital-library/internal/models"
)

type MockCategoryRepo struct {
	OnCreate func(c *models.Category) error
	OnGetAll func() ([]models.Category, error)
	OnDelete func(id int) error
}

func (m *MockCategoryRepo) Create(c *models.Category) error    { return m.OnCreate(c) }
func (m *MockCategoryRepo) GetAll() ([]models.Category, error) { return m.OnGetAll() }
func (m *MockCategoryRepo) Delete(id int) error                { return m.OnDelete(id) }

func TestCategoryService_CreateCategory(t *testing.T) {
	t.Run("Sanitization and slug generation", func(t *testing.T) {
		var capturedCategory *models.Category

		mockRepo := &MockCategoryRepo{
			OnCreate: func(c *models.Category) error {
				capturedCategory = c
				return nil
			},
		}

		service := NewCategoryService(mockRepo)

		inputName := "<script>alert('xss')</script>Historical Documents"

		category, err := service.CreateCategory(inputName)

		if err != nil {
			t.Fatalf("Expected nil error, got %v", err)
		}

		expectedName := "Historical Documents"
		if category.Name != expectedName {
			t.Errorf("Expected sanitized name %s, got %s", expectedName, category.Name)
		}

		expectedSlug := "historical-documents"
		if category.Slug != expectedSlug {
			t.Errorf("Expected slug %s, got %s", expectedSlug, category.Slug)
		}

		if capturedCategory.Name != expectedName {
			t.Errorf("Repository received unsanitized name")
		}
	})
}
