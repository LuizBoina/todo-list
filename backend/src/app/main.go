package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	r := 

	// get lists
	e.GET("/lists", func(c echo.Context) error {return nil})
	// put new list
	e.PUT("/list", func(c echo.Context) error {return nil})
	// put item's list
	e.PUT("/list/:id", func(c echo.Context) error {return nil})
	// delete list
	e.DELETE("/list", func(c echo.Context) error {return nil})
	// delete item's list
	e.DELETE("/list/:id", func(c echo.Context) error {return nil})
	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))
	e.Logger.Fatal(e.Start(":8000"))
}