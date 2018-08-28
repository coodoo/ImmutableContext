import React, { Component } from 'react'
import MyContext from './MyContext'

const Label = props => {
	const { value, updateStore } = props

	const onClick = () => {
		updateStore({
			value: Math.random()
				.toString()
				.substr(0, 5)
		})
	}

	return <button onClick={onClick}>Label2: {value}</button>
}

export default props => (
	<MyContext.Consumer>{payload => <Label {...payload} />}</MyContext.Consumer>
)
