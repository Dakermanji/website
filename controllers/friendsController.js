//! controllers/friendsController.js

export const addFriend = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ error: 'Email is required.' });
		}

		// Placeholder logic for processing friend request
		console.log(`Received friend request for: ${email}`);

		return res.status(200).json({
			message:
				'If email is in our database, your request was sent successfully!',
		});
	} catch (error) {
		console.error('Error processing friend request:', error);
		return res.status(500).json({
			error: 'An error occurred while processing your request.',
		});
	}
};
