const { User, Thought } = require('../models');

module.exports = {
    // GET all thoughts
    getThought(req,res) {
        Thought.find({})
            .then((thought) => res.json(thought))
            .catch((err) => res.json(err));
    },

    // GET single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId})
            .select('-__v')
            .then((thought) =>
            !thought
                ? res.status(500).json({ message: `No thoughts with this id`})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // CREATE new thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

    // UPDATE thought 

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: `No thought with this ID`})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId})
            .then((thought) =>
            !thought
                ? res.status(404).json({ message: ` No thoughts with this ID found`})
                : User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId }},
                    { new: true }
                )
            )
            .then((user) =>
            !user
                ? res.status(404).json({ message: `Thought deleted but no user with this ID`})
                : res.json({message: `Thought successfully deleted` })
            )
            .catch((err) => res.status(500).json(err));
    },

    // CREATE Reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        )
        .then((thought) => 
        !thought
            ? res.status(500).json({ message: `No thought with this ID!`})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err))
    },

    // DELETE Reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
            )
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: "No thought find with this ID!" })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
        },

};