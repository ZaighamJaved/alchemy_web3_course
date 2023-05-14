const scp = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')

function generateKeyPair() {
	try {
		const prvKey = scp.secp256k1.utils.randomPrivateKey()
		console.log(toHex(prvKey))
		const publicKey = scp.secp256k1.getPublicKey(prvKey)
		console.log('pub key: ', toHex(publicKey))
		const address = publicKey.slice(-20)
		console.log('address: ', toHex(address))
	} catch (error) {
		console.log(error)
	}
}

generateKeyPair()