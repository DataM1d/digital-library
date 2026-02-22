package main

import (
	"log"
	"net/http"
	"os"

	"github.com/DataM1d/digital-library/internal/handlers"
	"github.com/DataM1d/digital-library/internal/repository"
	"github.com/DataM1d/digital-library/pkg/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")

	db, err := database.NewPostgresDB(host, port, user, pass, name)
	if err != nil {
		log.Fatal("Could not connect to database: ", err)
	}
	defer db.Close()

	postRepo := repository.NewPostRepository(db)

	postHandler := handlers.NewPostHandler(postRepo)

	userRepo := repository.NewUserRepository(db)

	authHandler := handlers.NewAuthHandler(userRepo)

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status": "ok"}`))
	})

	r.Get("/posts", postHandler.GetPosts)

	r.Post("/register", authHandler.Register)

	log.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", r)
}
