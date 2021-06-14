module.exports = {
	secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'mySecretKeyHere',
	mongoDebug: process.env.NODE_ENV === 'production' ? false : true
}