package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Tags        []string           `bson:"tags" json:"tags"`
	AuthorID    primitive.ObjectID `bson:"authorId" json:"authorId"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
}