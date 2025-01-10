//! app.js
import app from './config/express.js';
import env from './config/dotenv.js';

app.get('/', (req, res) => {
	res.send('Test');
});

app.listen(env.PORT, () => {
	console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
});
