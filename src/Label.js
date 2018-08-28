import React, { Component } from 'react'
import MyContext from './MyContext'

const Label = props => {
	return (
		<MyContext.Consumer>
			{payload => {
				const onClick = () => {
					payload.updateStore({
						value: Math.random()
							.toString()
							.substr(0, 5)
					})
				}
				return <button onClick={onClick}>Label: {payload.value}</button>
			}}
		</MyContext.Consumer>
	)
}

export default Label
