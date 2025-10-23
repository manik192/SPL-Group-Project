package services

import (
	"errors"
	"github.com/you/indian-spice-hub/server/internal/repo"
	"github.com/you/indian-spice-hub/server/internal/util"
)

type Auth struct{ Users *repo.Users }

func (a *Auth) SignUp(email, password string) (int64, error) {
	h, err := util.Hash(password)
	if err != nil { return 0, err }
	return a.Users.Create(email, h)
}

func (a *Auth) Login(email, password string) (int64, error) {
	u, err := a.Users.ByEmail(email)
	if err != nil { return 0, errors.New("invalid credentials") }
	if !util.Check(u.PasswordHash, password) { return 0, errors.New("invalid credentials") }
	return u.ID, nil
}
