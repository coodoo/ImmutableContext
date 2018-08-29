import React from 'react'
const MyContext = React.createContext()

// 沒用到了
class PP extends React.Component {
	state = {
		foo: 'bar'
	}

	render() {
		console.log('child: ', this.props.children)
		return '---'
	}
}

class CC extends React.Component {
	render() {
		return (
			<MyContext.Consumer>
				{payload => {
					const Comp = this.props.children
					console.log('Comp=', Comp, ' >payload: ', payload)
					return <Comp {...payload} />
				}}
			</MyContext.Consumer>
		)
	}
}

export { PP, CC }
export default MyContext
