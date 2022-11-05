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
            .lean()
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
                User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: ObjectId(thought._id)}},
                    { runValidators: true, new: true }
                )
                res.json(thought)
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
            .then((thought) => 
                User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $pull: { thoughts: ObjectId(thought._id )}},
                    { runValidators: true, new: true }
                )
            )
            .then(() => res.json({ message: "Thought deleted "}))
            .catch((err) => res.status(500).json(err));
    }
}