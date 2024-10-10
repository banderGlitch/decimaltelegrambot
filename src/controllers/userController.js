import User from '../models/User.js';



export const updateCoins = async (req, res) => {
    try {
      const { telegramId, coins } = req.body;
      const user = await User.findOne({ telegramId });
  
      user.coins = coins;
      await user.save();
  
      res.status(200).json({
        message: 'Coins updated successfully',
      });
    } catch (error) {
      console.error('Error updating coins:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  



export const getUser = async (req, res) => {
  try {
    const { telegramId, name, username, photoUrl } = req.body;
    console.log("------------>>>>>-backendlogic>",telegramId, name, username, photoUrl);

    if (!telegramId) {
      return res.status(400).json({ error: 'Telegram ID is required' });
    }

    let user = await User.findOne({ telegramId });
    let isNewUser = false;

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.username = username || user.username;
      user.photoUrl = photoUrl || user.photoUrl;
    } else {
      // Create new user
      user = new User({
        telegramId,
        name,
        username,
        photoUrl,
        coins: 0 // Default value
      });
      isNewUser = true;
    }

    await user.save();

    res.status(200).json({
      message: isNewUser ? 'User registered successfully' : 'User updated successfully',
      user: {
        id: user._id,
        telegramId: user.telegramId,
        name: user.name,
        username: user.username,
        photoUrl: user.photoUrl,
        coins: user.coins
      },
    //   isNewUser: isNewUser
    });
  } catch (error) {
    console.error('Error registering/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getUserSpecific = async (req, res) => {
    try {
      const { telegramId } = req.params;
  
    //   if (!telegramId) {
    //     return res.status(400).json({ error: 'Telegram ID is required' });
    //   }
  
      const user = await User.findOne({ telegramId });
  
    //   if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
  
      res.status(200).json({
        user: {
          id: user._id,
          telegramId: user.telegramId,
          name: user.name,
          username: user.username,
          photoUrl: user.photoUrl,
          coins: user.coins
        }
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


// import User from '../models/User.js';

// export const registerUser = async (req, res) => {
//   try {
//     const { telegramId, name, username, photoUrl } = req.body;

//     if (!telegramId) {
//       return res.status(400).json({ error: 'Telegram ID is required' });
//     }

//     let user = await User.findOne({ telegramId });

//     if (user) {
//       user.name = name || user.name;
//       user.username = username || user.username;
//       user.photoUrl = photoUrl || user.photoUrl;
//     } else {
//       user = new User({
//         telegramId,
//         name,
//         username,
//         photoUrl,
//         coins: 0 // Default value
//       });
//     }

//     await user.save();

//     res.status(200).json({
//       message: 'User registered successfully',
//       user: {
//         id: user._id,
//         telegramId: user.telegramId,
//         name: user.name,
//         username: user.username,
//         photoUrl: user.photoUrl,
//         coins: user.coins
//       }
//     });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };