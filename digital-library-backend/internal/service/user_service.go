package service

import (
	"errors"

	"github.com/DataM1d/digital-library/internal/models"
	"github.com/DataM1d/digital-library/internal/repository"
	"github.com/DataM1d/digital-library/pkg/utils"
)

type UserService interface {
	Register(username, email, password string) (*models.User, error)
	Login(email, password string) (string, *models.User, error)
}

type userService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) Register(username, email, password string) (*models.User, error) {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username:     username,
		Email:        email,
		PasswordHash: hashedPassword,
		Role:         "user",
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Login(email, password string) (string, *models.User, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	if !utils.CheckPassword(password, user.PasswordHash) {
		return "", nil, errors.New("invalid email or password")
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}
