package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/DataM1d/digital-library/internal/repository"
)

type PostHandler struct {
	repo *repository.PostRepository
}

func NewPostHandler(repo *repository.PostRepository) *PostHandler {
	return &PostHandler{repo: repo}
}

func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := h.repo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}
