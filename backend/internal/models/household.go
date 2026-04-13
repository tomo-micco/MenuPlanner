package models

import (
	"time"

	"github.com/google/uuid"
)

type Household struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name" binding:"required"`
	CreatedAt time.Time `json:"createdAt"`
}

type User struct {
	ID          uuid.UUID `json:"id"`
	HouseholdID uuid.UUID `json:"householdId"`
	Name        string    `json:"name" binding:"required"`
	Email       string    `json:"email" binding:"required,email"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreateHouseholdRequest struct {
	HouseholdName string `json:"household_name" binding:"required"`
	UserName      string `json:"user_name" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
}

type CreateHouseholdResponse struct {
	HouseholdID uuid.UUID `json:"household_id"`
	UserID      uuid.UUID `json:"user_id"`
}
