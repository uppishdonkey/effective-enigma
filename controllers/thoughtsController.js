const {User,Thought} = require('../models');

const thoughtsController = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching thoughts' });
    }
  },

  async getThoughtById(req, res) {
    const { id } = req.params;
    try {
      const thought = await Thought.findById(id);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching the thought' });
    }
  },

  async createThought(req, res) {
    const { thoughtText, username, userId } = req.body;
  
    try {
      const newThought = new Thought({
        thoughtText,
        username,
      });
  
      const savedThought = await newThought.save();
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.thoughts.push(savedThought._id);
      await user.save();
  
      res.status(201).json(savedThought);
    } catch (err) {
      res.status(500).json({ message: 'Error creating the thought', error: err.message });
    }
  },

  async updateThought(req, res) {
    const { id } = req.params;
    const { thoughtText } = req.body;

    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        id,
        { thoughtText },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(500).json({ message: 'Error updating the thought' });
    }
  },


async deleteThought(req, res) {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(id);

    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const user = await User.findOne({ username: deletedThought.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.thoughts.indexOf(id);
    if (index !== -1) {
      user.thoughts.splice(index, 1);
      await user.save();
    }

    res.json(deletedThought);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting the thought' });
  }
},
  
  async createReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionText, username } = req.body;

    try {
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      const newReaction = {
        reactionText,
        username,
      };

      thought.reactions.push(newReaction);
      await thought.save();

      res.status(201).json(thought);
    } catch (err) {
      res.status(500).json({ message: 'Error creating the reaction' });
    }
  },

  async deleteReaction(req, res) {
    const { thoughtId, reactionId } = req.params;

    try {
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      const reactionIndex = thought.reactions.findIndex(
        (reaction) => reaction._id.toString() === reactionId
      );

      if (reactionIndex === -1) {
        return res.status(404).json({ message: 'Reaction not found' });
      }

      thought.reactions.splice(reactionIndex, 1);

      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json({ message: 'Error deleting the reaction' });
    }
  },
};

module.exports = thoughtsController;