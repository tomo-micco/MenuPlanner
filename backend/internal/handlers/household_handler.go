package handlers

import (
	"crypto/rand"
	"math/big"
	"net/http"
	"time"

	"menuplanner/internal/models"
	"menuplanner/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type HouseholdHandler struct {
	repo repository.HouseholdRepository
}

func NewHouseholdHandler(repo repository.HouseholdRepository) *HouseholdHandler {
	return &HouseholdHandler{repo: repo}
}

// CreateHousehold handles the creation of a new household and its initial user.
func (h *HouseholdHandler) CreateHousehold(c *gin.Context) {
	var req models.CreateHouseholdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	household := &models.Household{
		ID:        uuid.New(),
		Name:      req.HouseholdName,
		CreatedAt: time.Now(),
	}

	user := &models.User{
		ID:          uuid.New(),
		HouseholdID: household.ID,
		Name:        req.UserName,
		Email:       req.Email,
		CreatedAt:   time.Now(),
	}

	if err := h.repo.CreateHouseholdWithUser(c.Request.Context(), household, user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create household and user"})
		return
	}

	c.JSON(http.StatusCreated, models.CreateHouseholdResponse{
		HouseholdID: household.ID,
		UserID:      user.ID,
	})
}

// InviteToHousehold generates an invitation code for a household.
func (h *HouseholdHandler) InviteToHousehold(c *gin.Context) {
	householdIDStr := c.Param("id")
	householdID, err := uuid.Parse(householdIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid household ID"})
		return
	}

	code, err := generateRandomCode(8)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate invitation code"})
		return
	}

	expiresAt := time.Now().Add(24 * time.Hour)
	if err := h.repo.CreateInvitationCode(c.Request.Context(), householdID, code, expiresAt); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save invitation code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":       code,
		"expires_at": expiresAt,
	})
}

type JoinHouseholdRequest struct {
	Code     string `json:"code" binding:"required"`
	UserName string `json:"user_name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

// JoinHousehold handles a user joining a household using an invitation code.
func (h *HouseholdHandler) JoinHousehold(c *gin.Context) {
	var req JoinHouseholdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := &models.User{
		ID:        uuid.New(),
		Name:      req.UserName,
		Email:     req.Email,
		CreatedAt: time.Now(),
	}

	householdID, err := h.repo.JoinHousehold(c.Request.Context(), req.Code, user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired invitation code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"household_id": householdID,
		"user_id":      user.ID,
	})
}

func generateRandomCode(length int) (string, error) {
	const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // O, 0, I, 1 are excluded for clarity
	result := make([]byte, length)
	for i := range result {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		result[i] = charset[num.Int64()]
	}
	return string(result), nil
}
