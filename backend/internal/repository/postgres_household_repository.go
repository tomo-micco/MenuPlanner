package repository

import (
	"context"
	"fmt"
	"time"

	"menuplanner/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresHouseholdRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresHouseholdRepository(pool *pgxpool.Pool) *PostgresHouseholdRepository {
	return &PostgresHouseholdRepository{pool: pool}
}

func (r *PostgresHouseholdRepository) CreateHouseholdWithUser(ctx context.Context, household *models.Household, user *models.User) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Create household
	_, err = tx.Exec(ctx,
		"INSERT INTO households (id, name, created_at) VALUES ($1, $2, $3)",
		household.ID, household.Name, household.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert household: %w", err)
	}

	// Create user
	_, err = tx.Exec(ctx,
		"INSERT INTO users (id, household_id, name, email, created_at) VALUES ($1, $2, $3, $4, $5)",
		user.ID, user.HouseholdID, user.Name, user.Email, user.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert user: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (r *PostgresHouseholdRepository) CreateInvitationCode(ctx context.Context, householdID uuid.UUID, code string, expiresAt time.Time) error {
	id := uuid.New()
	_, err := r.pool.Exec(ctx,
		"INSERT INTO invitation_codes (id, household_id, code, expires_at) VALUES ($1, $2, $3, $4)",
		id, householdID, code, expiresAt)
	if err != nil {
		return fmt.Errorf("failed to insert invitation code: %w", err)
	}
	return nil
}

func (r *PostgresHouseholdRepository) JoinHousehold(ctx context.Context, code string, user *models.User) (uuid.UUID, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return uuid.Nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	var householdID uuid.UUID
	var expiresAt time.Time
	err = tx.QueryRow(ctx,
		"SELECT household_id, expires_at FROM invitation_codes WHERE code = $1",
		code).Scan(&householdID, &expiresAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return uuid.Nil, fmt.Errorf("invitation code not found")
		}
		return uuid.Nil, fmt.Errorf("failed to query invitation code: %w", err)
	}

	if time.Now().After(expiresAt) {
		return uuid.Nil, fmt.Errorf("invitation code expired")
	}

	user.HouseholdID = householdID
	_, err = tx.Exec(ctx,
		"INSERT INTO users (id, household_id, name, email, created_at) VALUES ($1, $2, $3, $4, $5)",
		user.ID, user.HouseholdID, user.Name, user.Email, user.CreatedAt)
	if err != nil {
		return uuid.Nil, fmt.Errorf("failed to insert user: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return uuid.Nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return householdID, nil
}
