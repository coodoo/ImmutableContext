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
				console.log( 'payload 是 state > 可改嗎？', Object.isExtensible(payload.actions), payload  )
				// payload.actions['bar'] = 'coo'
				// console.log( '改完: ', payload.actions  )
				// payload['coo'] = 'doo'
				return <Label {...payload} />
			}
		}
	</Consumer>
)

// export default props => 'fooo'
