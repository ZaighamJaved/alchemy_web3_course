import { useState } from "react"
import server from "./server"
import * as keccak from 'ethereum-cryptography/keccak'
import * as secp256k1 from 'ethereum-cryptography/secp256k1'
import * as utils from 'ethereum-cryptography/utils'
BigInt.prototype.toJSON = function () { return this.toString() }



function Transfer({ address, setBalance }) {
	const [sendAmount, setSendAmount] = useState("")
	const [recipient, setRecipient] = useState("")

	const setValue = (setter) => (evt) => setter(evt.target.value)

	async function transfer(evt) {
		evt.preventDefault()

		try {

			const hashedTx = keccak.keccak256(utils.utf8ToBytes(JSON.stringify({ amount: parseInt(sendAmount), recipient })))
			const sig = secp256k1.secp256k1.sign(hashedTx, address)
			const {
				data: { balance },
			} = await server.post(`send`, {
				sig: sig,
				hashedTx: utils.toHex(hashedTx),
				amount: parseInt(sendAmount),
				recipient,
			})
			setBalance(balance)
		} catch (ex) {
			console.log(ex)

			alert(ex?.response?.data?.message)
		}
	}

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder="1, 2, 3..."
					value={sendAmount}
					onChange={setValue(setSendAmount)}
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type an address, for example: 0x2"
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<input type="submit" className="button" value="Transfer" />
		</form>
	)
}

export default Transfer
