const { User, Thought } = require('../models');

const usersController = {
  async getAllUsers(req, res) {
    try {
      console.log('GET /api/users - Request received');
      const users = await User.find();
      console.log('GET /api/users - Sending response');
      res.json(users);
    } catch (err) {
      console.error('GET /api/users - Error fetching users:', err);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  async getSingleUser(req, res) {
    try {
      console.log(`GET /api/users/${req.params.id} - Request received`);
      const user = await User.findById(req.params.id)
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        console.log(`GET /api/users/${req.params.id} - User not found`);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(`GET /api/users/${req.params.id} - Sending response`);
      res.json(user);
    } catch (error) {
      console.error(`GET /api/users/${req.params.id} - Error fetching the user:`, error);
      res.status(500).json({ message: 'Error fetching the user' });
    }
  },

  async createUser(req, res) {
    console.log('POST /api/users - Request received');
    const { username, email } = req.body;
    const user = new User({ username, email });
    try {
      await user.save();
      console.log('POST /api/users - Sending response');
      res.json(user);
    } catch (error) {
      console.error('POST /api/users - Error creating the user:', error);
      res.status(500).json({ message: 'Error creating the user' });
    }
  },

  async updateUser(req, res) {
    console.log(`PUT /api/users/${req.params.id} - Request received`);
    const { username, email } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { username, email },
        { new: true }
      );
      if (!user) {
        console.log(`PUT /api/users/${req.params.id} - User not found`);
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(`PUT /api/users/${req.params.id} - Sending response`);
      res.json(user);
    } catch (error) {
      console.error(`PUT /api/users/${req.params.id} - Error updating the user:`, error);
      res.status(500).json({ message: 'Error updating the user' });
    }
  },

  async deleteUser(req, res) {
    console.log(`DELETE /api/users/${req.params.id} - Request received`);
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        console.log(`DELETE /api/users/${req.params.id} - User not found`);
        return res.status(404).json({ message: 'User not found' });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      console.log(`DELETE /api/users/${req.params.id} - Sending response`);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(`DELETE /api/users/${req.params.id} - Error deleting the user:`, error);
      res.status(500).json({ message: 'Error deleting the user' });
    }
  },

  async addFriend(req, res) {
    console.log('POST /api/users/:userId/friends/:friendId - Request received');
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    console.log('userId:', userId);
    console.log('friendId:', friendId);

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      ).populate('friends');

      console.log('updated user:', user);

      if (!user) {
        console.log('POST /api/users/:userId/friends/:friendId - User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('POST /api/users/:userId/friends/:friendId - Sending response');
      res.json(user);
    } catch (error) {
      console.error('POST /api/users/:userId/friends/:friendId - Error adding a friend:', error);
      res.status(500).json({ message: 'Error adding a friend' });
    }
  },

  async removeFriend(req, res) {
    console.log('DELETE /api/users/:userId/friends/:friendId - Request received');
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      ).populate('friends');

      if (!user) {
        console.log('DELETE /api/users/:userId/friends/:friendId - User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('DELETE /api/users/:userId/friends/:friendId - Sending response');
      res.json(user);
    } catch (error) {
      console.error('DELETE /api/users/:userId/friends/:friendId - Error removing a friend:', error);
      res.status(500).json({ message: 'Error removing a friend' });
    }
  },
};

module.exports = usersController;