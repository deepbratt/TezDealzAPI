const app = require('./server');
const PORT = 3003; // port

app.listen(PORT, () => {
	console.log(`listening on ${PORT}`);
});
