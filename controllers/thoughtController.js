const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                const thoughtObj = {
                    thoughts,
                };
                return res.json(thoughtObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then(async (thought) => 
                !thought
                    ? res.status(404).json({ message: 'No message with that ID'})
                    : res.json({thought})
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            })
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id }},
                    { new: true }
                )
            })
            .then((user) => {
                !user
                    ? res.status(404).json({message: 'Thought created, but no user by that ID exists'})
                    : res.json("Thought successfully created")
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            })
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: { thoughtText: req.body.thoughtText }},
            {runValidators: true, new: true}
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No message with that ID'})
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $pull: { thoughts: ObjectId(thought._id )}},
                    { runValidators: true, new: true }
                )}
            )
            .then((user) => 
                !user
                    ? res.status(404).json({message: "Thought deleted, but user not found"})
                    : res.json("Thought successfully deleted")
            )
            .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: "No message with that ID"})
                    : thought.reactions.push({
                        reactionBody: req.body.reactionBody,
                        username: req.body.username
                    });
                thought.save();
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: {reactions: { reactionId: ObjectId(req.body.reactionId)}}},
            { runValidators: true, new: true}
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: "No message or reaction with that ID"})
                : res.json({ message: "Reaction deleted"})
        )
        .catch((err) => res.status(500).json(err));
    }
}