package service

import (
	"testing"

	"github.com/DataM1d/digital-library/internal/models"
)

type MockUserRepository struct {
	OnGetByEmail func(email string) (*models.User, error)
	OnCreate     func(user *models.User) error
}

func (m *MockUserRepository) GetByEmail(email string) (*models.User, error) {
	return m.OnGetByEmail(email)
}

func (m *MockUserRepository) Create(user *models.User) error {
	return m.OnCreate(user)
}

func TestRegisterUser(t *testing.T) {
	t.Run("Fail if email already exists", func(t *testing.T) {
		mockRepo := &MockUserRepository{
			OnGetByEmail: func(email string) (*models.User, error) {
				return &models.User{Email: email}, nil
			},
		}

		service := NewUserService(mockRepo)

		_, err := service.Register("newuser", "exists@test.com", "password123")

		if err == nil {
			t.Error("Expected error when email exists, got nil")
		}
		if err.Error() != "user already exists" {
			t.Errorf("Expected 'user already exists', got %v", err)
		}
	})

	t.Run("Success path - check hashing and creation", func(t *testing.T) {
		var capturedUser *models.User

		mockRepo := &MockUserRepository{
			OnGetByEmail: func(email string) (*models.User, error) {
				return nil, nil
			},
			OnCreate: func(user *models.User) error {
				capturedUser = user
				return nil
			},
		}

		service := NewUserService(mockRepo)
		password := "secure-pass-123"

		user, err := service.Register("collector1", "new@test.com", password)

		if err != nil {
			t.Fatalf("Registration failed: %v", err)
		}

		if user == nil || capturedUser == nil {
			t.Fatal("User was not created or captured")
		}

		if capturedUser.Username != "collector1" {
			t.Errorf("Expected username collector1, got %s", capturedUser.Username)
		}

		if capturedUser.PasswordHash == password {
			t.Error("Password was not hashed! It matches the plain text.")
		}

		if len(capturedUser.PasswordHash) < 20 {
			t.Error("PasswordHash looks too short to be a valid hash")
		}
	})
}
