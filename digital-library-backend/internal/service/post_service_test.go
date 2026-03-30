package service

import (
	"context"
	"testing"

	"github.com/DataM1d/digital-library/internal/domain"
	"github.com/DataM1d/digital-library/internal/models"
)

type MockPostRepo struct {
	OnSlugExists      func(ctx context.Context, slug string) (bool, error)
	OnCreate          func(ctx context.Context, p *models.Post) error
	OnUpdate          func(ctx context.Context, p *models.Post) error                // Added for UpdatePost tests
	OnSyncTags        func(ctx context.Context, postID int, tagNames []string) error // The Fix
	OnWithTx          func(ctx context.Context, fn func(domain.PostRepo) error) error
	OnGetAllImageURLs func(ctx context.Context) ([]string, error)
}

func (m *MockPostRepo) SlugExists(ctx context.Context, s string) (bool, error) {
	if m.OnSlugExists != nil {
		return m.OnSlugExists(ctx, s)
	}
	return false, nil
}

func (m *MockPostRepo) SyncTags(ctx context.Context, postID int, tagName []string) error {
	if m.OnSyncTags != nil {
		return m.OnSyncTags(ctx, postID, tagName)
	}
	return nil
}

func (m *MockPostRepo) Create(ctx context.Context, p *models.Post) error {
	if m.OnCreate != nil {
		return m.OnCreate(ctx, p)
	}
	return nil
}

func (m *MockPostRepo) WithTransaction(ctx context.Context, fn func(domain.PostRepo) error) error {
	if m.OnWithTx != nil {
		return m.OnWithTx(ctx, fn)
	}
	return fn(m)
}

func (m *MockPostRepo) GetAllImageURLs(ctx context.Context) ([]string, error) {
	if m.OnGetAllImageURLs != nil {
		return m.OnGetAllImageURLs(ctx)
	}
	return []string{}, nil
}

func (m *MockPostRepo) Update(ctx context.Context, p *models.Post) error          { return nil }
func (m *MockPostRepo) Delete(ctx context.Context, id int) error                  { return nil }
func (m *MockPostRepo) GetByID(ctx context.Context, id int) (*models.Post, error) { return nil, nil }
func (m *MockPostRepo) GetBySlug(ctx context.Context, s string, id int) (*models.Post, error) {
	return nil, nil
}
func (m *MockPostRepo) GetAll(ctx context.Context, c, s string, t []string, l, o int, st string, id int) ([]models.Post, int, error) {
	return nil, 0, nil
}
func (m *MockPostRepo) ToggleLike(ctx context.Context, u, p int) (bool, error) { return false, nil }
func (m *MockPostRepo) GetUserLikedPosts(ctx context.Context, u int) ([]models.Post, error) {
	return nil, nil
}
func (m *MockPostRepo) UpdateBlurHash(ctx context.Context, id int, h string) error { return nil }

type MockTagRepo struct {
	OnSyncPostTags func(ctx context.Context, postID int, tagNames []string) error
}

func (m *MockTagRepo) SyncPostTags(ctx context.Context, id int, tags []string) error {
	if m.OnSyncPostTags != nil {
		return m.OnSyncPostTags(ctx, id, tags)
	}
	return nil
}

func TestPostService_CreateLibraryEntry(t *testing.T) {
	ctx := context.Background()

	t.Run("Unauthorized if not admin", func(t *testing.T) {
		service := NewPostService(&MockPostRepo{}, &MockTagRepo{})
		err := service.CreateLibraryEntry(ctx, &models.Post{}, []string{}, "user", 1)
		if err == nil || err.Error() != "unauthorized: system access restricted to admin" {
			t.Errorf("Expected unauthorized error, got %v", err)
		}
	})

	t.Run("Slug generation and sanitization logic", func(t *testing.T) {
		var capturedPost *models.Post
		mockPostRepo := &MockPostRepo{
			OnSlugExists: func(ctx context.Context, slug string) (bool, error) { return false, nil },
			OnCreate: func(ctx context.Context, p *models.Post) error {
				capturedPost = p
				return nil
			},
		}

		service := NewPostService(mockPostRepo, &MockTagRepo{})
		post := &models.Post{
			Title:   "<h1>The Swedish Archive</h1>",
			Content: "<script>alert('xss')</script><p>Safe content</p>",
		}

		err := service.CreateLibraryEntry(ctx, post, []string{"history"}, "admin", 42)

		if err != nil {
			t.Fatalf("Creation failed: %v", err)
		}

		if capturedPost.Title != "The Swedish Archive" {
			t.Errorf("Title not sanitized: %s", capturedPost.Title)
		}
		if capturedPost.Content != "<p>Safe content</p>" {
			t.Errorf("Content not sanitized: %s", capturedPost.Content)
		}
		if capturedPost.Slug != "the-swedish-archive" {
			t.Errorf("Expected slug the-swedish-archive, got %s", capturedPost.Slug)
		}
	})
}

func TestCreatePost_SyncsTags(t *testing.T) {
	ctx := context.Background()
	tagsSynced := false
	expectedID := 101
	testTags := []string{"Renaissance"}
	var mockRepo *MockPostRepo

	mockRepo = &MockPostRepo{
		OnCreate: func(ctx context.Context, p *models.Post) error {
			p.ID = expectedID
			return nil
		},
		OnSyncTags: func(ctx context.Context, postID int, tagNames []string) error {
			if postID == expectedID && len(tagNames) > 0 && tagNames[0] == "Renaissance" {
				tagsSynced = true
			}
			return nil
		},
		OnWithTx: func(ctx context.Context, fn func(domain.PostRepo) error) error {
			return fn(mockRepo)
		},
		OnSlugExists: func(ctx context.Context, slug string) (bool, error) {
			return false, nil
		},
	}

	service := NewPostService(mockRepo, nil)
	post := &models.Post{
		Title:   "Renaissance Art",
		Content: "Content about the Renaissance period.",
	}

	err := service.CreateLibraryEntry(ctx, post, testTags, "admin", 1)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if !tagsSynced {
		t.Error("Expected SyncTags to be called, but it was not")
	}

	if post.ID != expectedID {
		t.Errorf("Expected ID %d, got %d", expectedID, post.ID)
	}
}
