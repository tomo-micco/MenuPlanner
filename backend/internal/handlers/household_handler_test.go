package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"menuplanner/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// MockHouseholdRepository is a mock for HouseholdRepository
type MockHouseholdRepository struct {
	CreateFunc func(ctx context.Context, household *models.Household, user *models.User) error
	InviteFunc func(ctx context.Context, householdID uuid.UUID, code string, expiresAt time.Time) error
	JoinFunc   func(ctx context.Context, code string, user *models.User) (uuid.UUID, error)
}

func (m *MockHouseholdRepository) CreateHouseholdWithUser(ctx context.Context, household *models.Household, user *models.User) error {
	if m.CreateFunc != nil {
		return m.CreateFunc(ctx, household, user)
	}
	return nil
}

func (m *MockHouseholdRepository) CreateInvitationCode(ctx context.Context, householdID uuid.UUID, code string, expiresAt time.Time) error {
	if m.InviteFunc != nil {
		return m.InviteFunc(ctx, householdID, code, expiresAt)
	}
	return nil
}

func (m *MockHouseholdRepository) JoinHousehold(ctx context.Context, code string, user *models.User) (uuid.UUID, error) {
	if m.JoinFunc != nil {
		return m.JoinFunc(ctx, code, user)
	}
	return uuid.Nil, nil
}

func TestCreateHousehold(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockRepo := &MockHouseholdRepository{}
	handler := NewHouseholdHandler(mockRepo)

	t.Run("正常系: 家族と初期ユーザーが作成されること", func(t *testing.T) {
		r := gin.Default()
		r.POST("/households", handler.CreateHousehold)

		body := map[string]string{
			"household_name": "田中家",
			"user_name":      "太郎",
			"email":          "taro@example.com",
		}
		jsonBody, _ := json.Marshal(body)
		req, _ := http.NewRequest(http.MethodPost, "/households", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		
		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.NotNil(t, response["household_id"])
		assert.NotNil(t, response["user_id"])
	})

	t.Run("異常系: 必須項目が不足している場合に 400 を返すこと", func(t *testing.T) {
		r := gin.Default()
		r.POST("/households", handler.CreateHousehold)

		body := map[string]string{
			"household_name": "",
			"user_name":      "太郎",
			"email":          "taro@example.com",
		}
		jsonBody, _ := json.Marshal(body)
		req, _ := http.NewRequest(http.MethodPost, "/households", bytes.NewBuffer(jsonBody))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestInviteToHousehold(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockRepo := &MockHouseholdRepository{}
	handler := NewHouseholdHandler(mockRepo)

	t.Run("正常系: 招待コードが生成されること", func(t *testing.T) {
		r := gin.Default()
		r.POST("/households/:id/invite", handler.InviteToHousehold)

		householdID := uuid.New()
		req, _ := http.NewRequest(http.MethodPost, "/households/"+householdID.String()+"/invite", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var response map[string]string
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Len(t, response["code"], 8)
	})
}

func TestJoinHousehold(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockRepo := &MockHouseholdRepository{}
	handler := NewHouseholdHandler(mockRepo)

	t.Run("正常系: 招待コードで家族に参加できること", func(t *testing.T) {
		r := gin.Default()
		r.POST("/households/join", handler.JoinHousehold)

		householdID := uuid.New()
		mockRepo.JoinFunc = func(ctx context.Context, code string, user *models.User) (uuid.UUID, error) {
			return householdID, nil
		}

		body := map[string]string{
			"code":      "ABC12345",
			"user_name": "次郎",
			"email":     "jiro@example.com",
		}
		jsonBody, _ := json.Marshal(body)
		req, _ := http.NewRequest(http.MethodPost, "/households/join", bytes.NewBuffer(jsonBody))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, householdID.String(), response["household_id"])
		assert.NotNil(t, response["user_id"])
	})
}
