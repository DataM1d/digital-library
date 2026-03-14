package handlers

import (
	"net/http"

	"github.com/DataM1d/digital-library/internal/models"
	"github.com/DataM1d/digital-library/internal/service"
	"github.com/gin-gonic/gin"
)

type CommentHandler struct {
	commentService service.CommentService
}

func NewCommentHandler(s service.CommentService) *CommentHandler {
	return &CommentHandler{commentService: s}
}

func (h *CommentHandler) GetByPost(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post identifier required"})
		return
	}

	comments, err := h.commentService.GetCommentsByPostSlug(slug)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comments not found for this artifact"})
		return
	}

	c.JSON(http.StatusOK, comments)
}

func (h *CommentHandler) Create(c *gin.Context) {
	slug := c.Param("slug")
	val, exists := c.Get("user_id")
	userID, ok := val.(int)

	if !exists || !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired or invalid"})
		return

	}

	var input struct {
		Content  string `json:"content" binding:"required"`
		ParentID *int   `json:"parent_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment content is required"})
		return
	}

	comment := &models.Comment{
		UserID:   userID,
		Content:  input.Content,
		ParentID: input.ParentID,
	}

	if err := h.commentService.CreateComment(slug, comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, comment)
}
