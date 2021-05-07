package services

import (
	"errors"
	"os"
	"time"
	jwt "github.com/dgrijalva/jwt-go"
)

type Claims struct {
	Id string
	Email string
	Scope string
	jwt.StandardClaims
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type JWTCredentials struct {
	AccessToken string `json:"accessToken"`
	RequestToken string `json:"requestToken"`
}

const (
	ACCESS_TIME_LIMIT = time.Minute * 1
	REFRESH_TIME_LIMIT = time.Hour * 24 * 7
	ACCESS_SCOPE = "access"
	REFRESH_SCOPE = "refresh"
)


func GetTokens(id, email string) *JWTCredentials {
	secret := []byte(os.Getenv("JWT_SECRET"))
	accessClaims := Claims{
		id,
		email,
		ACCESS_SCOPE,
		jwt.StandardClaims{
			IssuedAt: time.Now().UTC().Unix(),
			ExpiresAt: time.Now().Add(ACCESS_TIME_LIMIT).UTC().Unix(),
		},
	}

	accessToken, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString(secret)

	refreshClaims := Claims{
		id,
		email,
		REFRESH_SCOPE,
		jwt.StandardClaims{
			IssuedAt: time.Now().UTC().Unix(),
			ExpiresAt: time.Now().Add(REFRESH_TIME_LIMIT).UTC().Unix(),
		},
	}

	refreshToken, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString(secret)
	return &JWTCredentials{accessToken, refreshToken}
}

func verifyToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil 
	})

	if !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("cannot parse token")
	}

	return claims, nil
}

func VerifyAccessToken(tokenString string) (bool, error){
	claims, err := verifyToken(tokenString)
	if err != nil {
		return false, err
	}
	if claims.Scope != ACCESS_SCOPE {
		return false, errors.New("invalid scope")
	}
	return true, nil
}


func RefreshAccessToken(refreshToken string) (*JWTCredentials, error) {
	claims, err := verifyToken(refreshToken)
	if err != nil {
		return nil, err
	}
	if claims.Scope != REFRESH_SCOPE {
		return nil, errors.New("invalid scope")
	}
	return GetTokens(claims.Id, claims.Email), nil
}

