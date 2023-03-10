const { User, Thought } = require('../models');

module.exports = {
    // GET all users
    getUsers(req, res) {
        User.find({})
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    // GET single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
            !user 
                ? res.status(404).json({ message: 'User with that ID does not exist'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err)); 
    },

    // CREATE new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    //UPDATE user
    updateUser(req,res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: "User with that ID does not exist" })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE user 
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => 
            !user
                ? res.status(404).json({ message: 'User with that ID does not exist'})
                : Thought.deleteMany({ _id: { $in: user.thoughts }})
            )
            .then(() => res.json({ message: `User deleted!`}))
            .catch((err) => res.status(500).json(err));
    },

    //ADD Friend
        addFriend(req, res) {
            User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
            )
            .then((user) =>
                !user
                ? res.status(404).json({ message: "User with that ID does not exist" })
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
        },

    // DELETE Friend
        deleteFriend(req, res) {
            User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
            )
            .then(
                (user) =>
                !user
                    ? res.status(404).json({ message: "User with that ID does not exist" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
        },
};