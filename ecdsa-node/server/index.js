const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042
const { toHex, hexToBytes } = require("ethereum-cryptography/utils")
const secp = require("ethereum-cryptography/secp256k1")



app.use(cors())
app.use(express.json())

const balances = {
	"33e06045fcc7aad83142c143a46eb8b664b7e6a2": 100, // prvKey: c1a05a8fce6161182ccc6dd4fc1a2e8d021ab2f837b916bfa31fa97d139e35ce
	"285cb10b22b10fa4c114ff6a2fa22b03727623a3": 50, // prvKey: a76e7afd2b789ea66ada4cc2fe3d19010487a49b36f781401e61af057ee610ec
	"5caeaca08768d662c492a7e5d7a78a8e12a05ed9": 75, // prvKey: 768bd1c0ab0fc3f97fc6df83df6ea398d9f40641d1c49bbe44907c7bc7a146d2
}

app.get("/balance/:address", (req, res) => {
	const { address } = req.params
	const balance = balances[address] || 0
	res.send({ balance })
})

app.post("/send", (req, res) => {
	let { sig, hashedTx, recipient, amount } = req.body
	sig = new secp.secp256k1.Signature(BigInt(sig.r), BigInt(sig.s), sig.recovery)
	const sender = toHex(hexToBytes(sig.recoverPublicKey(hexToBytes(hashedTx)).toHex()).slice(-20))
	setInitialBalance(sender)
	setInitialBalance(recipient)

	if (balances[sender] < amount) {
		res.status(400).send({ message: "Not enough funds!" })
	} else {
		balances[sender] -= amount
		balances[recipient] += amount
		res.send({ balance: balances[sender] })
	}
})

app.listen(port, () => {
	console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0
	}
}
