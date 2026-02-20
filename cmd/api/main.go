package main

import (
	"log"
	"net/http"

	"github.com/DataM1d/digital-library/pkg/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	db, err := database.NewPostgresDB("127.0.0.1", "5432", "user", "password", "digital_library")
	if err != nil {
		log.Fatal("Could not connect to database: ", err)
	}
	defer db.Close()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "ok", "message": "server is running and DB is connected"}`))
	})

	log.Println("Starting server on :8080...")
	err = http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal("Server failed: ", err)
	}
}
