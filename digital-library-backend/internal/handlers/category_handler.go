package handlers

import (
	"net/http"
	"strconv"

	"github.com/DataM1d/digital-library/internal/service"
	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(s *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: s}
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var input struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category name is required"})
		return
	}

	cat, err := h.service.CreateCategory(input.Name)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Category already exists or could not be created"})
		return
	}

	c.JSON(http.StatusCreated, cat)
}

func (h *CategoryHandler) GetCategories(c *gin.Context) {
	cats, err := h.service.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve archive taxonomy"})
		return
	}
	c.JSON(http.StatusOK, cats)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	if err := h.service.DeleteCategory(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category removed from taxonomy"})
}
