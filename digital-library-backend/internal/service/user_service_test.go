package service

import (
	"context"
	"testing"

	"github.com/DataM1d/digital-library/internal/models"
)

type MockUserRepository struct {
	OnGetByEmail func(ctx context.Context, email string) (*models.User, error)
	OnCreate     func(ctx context.Context, user *models.User) error
	OnGetByID    func(ctx context.Context, id int) (*models.User, error)
}

func (m *MockUserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	return m.OnGetByEmail(ctx, email)
}
func (m *MockUserRepository) Create(ctx context.Context, user *models.User) error {
	return m.OnCreate(ctx, user)
}
func (m *MockUserRepository) GetByID(ctx context.Context, id int) (*models.User, error) {
	return m.OnGetByID(ctx, id)
}

func TestRegisterUser(t *testing.T) {
	ctx := context.Background()

	t.Run("Fail if email already exists", func(t *testing.T) {
		mockRepo := &MockUserRepository{
			OnGetByEmail: func(ctx context.Context, email string) (*models.User, error) {
				return &models.User{Email: email}, nil
			},
		}

		service := NewUserService(mockRepo)
		_, err := service.Register(ctx, "newuser", "exists@test.com", "password123")

		if err == nil {
			t.Error("Expected error when email exists, got nil")
		}
	})

	t.Run("Success path - check hashing", func(t *testing.T) {
		var capturedUser *models.User
		mockRepo := &MockUserRepository{
			OnGetByEmail: func(ctx context.Context, email string) (*models.User, error) {
				return nil, nil
			},
			OnCreate: func(ctx context.Context, user *models.User) error {
				capturedUser = user
				return nil
			},
		}

		service := NewUserService(mockRepo)
		_, err := service.Register(ctx, "collector1", "new@test.com", "secure-pass-123")

		if err != nil {
			t.Fatalf("Registration failed: %v", err)
		}

		if capturedUser.PasswordHash == "secure-pass-123" {
			t.Error("Password was not hashed!")
		}
	})
}
