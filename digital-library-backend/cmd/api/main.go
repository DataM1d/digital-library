package main

import (
	"log"
	"os"

	"github.com/DataM1d/digital-library/internal/handlers"
	"github.com/DataM1d/digital-library/internal/middleware"
	"github.com/DataM1d/digital-library/internal/repository"
	"github.com/DataM1d/digital-library/internal/service"
	"github.com/DataM1d/digital-library/pkg/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	db, err := database.NewPostgresDB(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	userRepo := repository.NewUserRepository(db)
	postRepo := repository.NewPostRepository(db)
	commentRepo := repository.NewCommentRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)

	userService := service.NewUserService(userRepo)
	postService := service.NewPostService(postRepo)
	commentService := service.NewCommentService(commentRepo)
	categoryService := service.NewCategoryService(categoryRepo)

	authHandler := handlers.NewAuthHandler(userService)
	postHandler := handlers.NewPostHandler(postService)
	commentHandler := handlers.NewCommentHandler(commentService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.Static("/uploads", "./uploads")

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)
	r.GET("/posts", postHandler.GetPosts)
	r.GET("/posts/s/:slug", postHandler.GetBySlug)
	r.GET("/categories", categoryHandler.GetCategories)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/posts", postHandler.CreatePost)
		protected.PUT("/posts/:id", postHandler.UpdatePost)
		protected.DELETE("/posts/:id", postHandler.DeletePost)
		protected.POST("/posts/:id/like", postHandler.ToggleLike)
		protected.GET("/users/me/likes", postHandler.GetMyLikedPosts)
		protected.POST("/upload", postHandler.UploadImage)
		protected.POST("/categories", categoryHandler.CreateCategory)
		protected.DELETE("/categories/:id", categoryHandler.DeleteCategory)
		protected.POST("/posts/:id/comments", commentHandler.CreateComment)
	}

	log.Println("Starting Gin server on :8080")
	r.Run(":8080")
}
