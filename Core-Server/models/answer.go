package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Answer struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	QuestionID primitive.ObjectID `bson:"questionId" json:"questionId"`
	AuthorID   primitive.ObjectID `bson:"authorId" json:"authorId"`
	Content    string             `bson:"content" json:"content"`
	Upvotes    int                `bson:"upvotes,omitempty" json:"upvotes"`
	Downvotes  int                `bson:"downvotes,omitempty" json:"downvotes"`
	IsAccepted bool               `bson:"isAccepted" json:"isAccepted"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
}
