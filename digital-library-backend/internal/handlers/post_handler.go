package handlers

import (
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/DataM1d/digital-library/internal/models"
	"github.com/DataM1d/digital-library/internal/service"
	"github.com/bbrks/go-blurhash"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PostHandler struct {
	postService *service.PostService
}

func NewPostHandler(s *service.PostService) *PostHandler {
	return &PostHandler{postService: s}
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	role := c.GetString("role")
	userID := c.GetInt("uzer_id")

	//Security: Limit total request size (5MB + buffer)
	const maxFileSize = 5 << 20
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxFileSize+(1<<10))

	//Multipart: Parse the form
	if err := c.Request.ParseMultipartForm(maxFileSize); err != nil {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "File too large (Max 5MB)"})
		return
	}

	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image field is required"})
		return
	}
	defer file.Close()

	//Security: MIME type Whitelist Sniffing
	buff := make([]byte, 512)
	if _, err := file.Read(buff); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file header"})
		return
	}
	file.Seek(0, 0) //Reset pointer for saving

	contentType := http.DetectContentType(buff)
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}

	if !allowedTypes[contentType] {
		c.JSON(http.StatusUnsupportedMediaType, gin.H{"error": "Only JPEG, PNG, and WEBP are allowed"})
		return
	}

	//UNIQUENESS: UUID + Timestamp filename
	ext := filepath.Ext(header.Filename)
	fileName := fmt.Sprintf("%d-%s%s", time.Now().Unix(), uuid.New().String(), ext)
	path := filepath.Join("uploads", fileName)

	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", os.ModePerm)
	}

	dst, err := os.Create(path)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	//DB PREP: Save post with pending hash
	categoryID, _ := strconv.Atoi(c.Request.FormValue("category_id"))
	post := models.Post{
		Title:      c.Request.FormValue("title"),
		Content:    c.Request.FormValue("content"),
		CategoryID: categoryID,
		ImageURL:   "/uploads/" + fileName,
		BlurHash:   "processing",
		Status:     c.DefaultPostForm("status", "published"),
		AltText:    c.Request.FormValue("alt_text"),
	}

	err = h.postService.CreateLibraryEntry(&post, role, userID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	//BlurHASH: Launch background Go routine
	go h.generateBlurHashInBackgroun(path, post.ID)

	//Return created post immediately
	c.JSON(http.StatusCreated, post)
}

func (h *PostHandler) generateBlurHashInBackgroun(filePath string, postID int) {
	file, err := os.Open(filePath)
	if err != nil {
		return
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		return
	}

	hash, err := blurhash.Encode(4, 3, img)
	if err != nil {
		return
	}

	_ = h.postService.UpdateBlurHash(postID, hash)
}

func (h *PostHandler) UploadImage(c *gin.Context) {
	file, handler, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form key"})
		return
	}
	defer file.Close()

	fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), handler.Filename)
	path := filepath.Join("uploads", fileName)

	dst, err := os.Create(path)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	file.Seek(0, 0)
	img, _, err := image.Decode(file)
	var hash string
	if err == nil {
		hash, _ = blurhash.Encode(4, 3, img)
	}

	c.JSON(http.StatusOK, gin.H{
		"url":      "/uploads/" + fileName,
		"blurhash": hash,
	})
}

func (h *PostHandler) GetPosts(c *gin.Context) {
	search := c.Query("search")
	category := c.Query("category")
	tags := c.QueryArray("tags")
	role := c.GetString("role")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	posts, total, err := h.postService.GetAllPosts(category, search, tags, page, limit, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": posts,
		"meta": gin.H{
			"current_page": page,
			"limit":        limit,
			"total_items":  total,
			"total_pages":  (total + limit - 1) / limit,
		},
	})
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
	role := c.GetString("role")
	userID := c.GetInt("user_id")
	id, _ := strconv.Atoi(c.Param("id"))

	var post models.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	post.ID = id

	err := h.postService.UpdatePost(&post, role, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post updated successfully"})
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	role := c.GetString("role")
	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id, _ := strconv.Atoi(c.Param("id"))
	err := h.postService.DeletePost(id, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func (h *PostHandler) ToggleLike(c *gin.Context) {
	userID := c.GetInt("user_id")
	postID, _ := strconv.Atoi(c.Param("id"))

	liked, err := h.postService.ToggleLike(userID, postID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	msg := "Post unliked"
	if liked {
		msg = "Post liked"
	}

	c.JSON(http.StatusOK, gin.H{
		"message": msg,
		"liked":   liked,
	})
}

func (h *PostHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	post, err := h.postService.GetPostBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) GetMyLikedPosts(c *gin.Context) {
	userID := c.GetInt("user_id")
	posts, err := h.postService.GetLikedPosts(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch liked posts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}
