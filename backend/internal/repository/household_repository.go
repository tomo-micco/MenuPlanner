package repository

import (
	"context"
	"time"

	"menuplanner/internal/models"

	"github.com/google/uuid"
)

type HouseholdRepository interface {
	CreateHouseholdWithUser(ctx context.Context, household *models.Household, user *models.User) error
	CreateInvitationCode(ctx context.Context, householdID uuid.UUID, code string, expiresAt time.Time) error
	JoinHousehold(ctx context.Context, code string, user *models.User) (uuid.UUID, error)
}
