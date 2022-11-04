const { Schema, Mongoose  } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: new Mongoose.Types.ObjectId(),
            default: new ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,

        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    }
);