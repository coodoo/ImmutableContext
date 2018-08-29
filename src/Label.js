import React from 'react'
import { Consumer } from './ImmutableContext'

const Label = props => {
	console.log('label 內拿到 props: ', props)
	const {
		value,
		actions: { myMethod }
	} = props

	const onClick = () => {
		myMethod({
			value: Math.random()
				.toString()
				.substr(0, 5)
		})
	}

	return <button onClick={onClick}>Label2: {value}</button>
}


export default props => (
	<Consumer>
		{
			// 此 payload 為 immutable，無法更改
			payload => {
				console.log( '看 payload 內容:', payload )
				return <Label {...payload} />
			}
		}
	</Consumer>
)

// export default props => 'fooo'
