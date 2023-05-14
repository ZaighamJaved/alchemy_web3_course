import server from "./server"

import * as scep from 'ethereum-cryptography/secp256k1'
import { toHex, hexToBytes } from 'ethereum-cryptography/utils'

function Wallet({ address, setAddress, balance, setBalance }) {
	async function onChange(evt) {
		let address = evt.target.value
		setAddress(address)
		if (address) {
			address = toHex(scep.secp256k1.getPublicKey(hexToBytes(address)).slice(-20))
			console.log(address)
			const {
				data: { balance },
			} = await server.get(`balance/${address}`)
			setBalance(balance)
		} else {
			setBalance(0)
		}
	}

	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Private Key
				<input placeholder="Type your private key" value={address} onChange={onChange}></input>
			</label>

			<div className="balance">Balance: {balance}</div>
		</div>
	)
}

export default Wallet
