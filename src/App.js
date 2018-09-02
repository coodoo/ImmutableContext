import React from 'react'
import HisStore from './HisStore'
import HerStore from './HerStore'
import merge from 'deepmerge'
import { SimpleLabel, WrappedLabel, AdoptedLabel, HOCLabel } from './Label'


class App extends React.PureComponent {

	constructor(props) {
		super(props)

		// 示範：從元件內偷藏 cb 到 global state 內供子元件存取
		// 將來會在 Label 內取用
		props.updateState({
			callbacks: {
				App: {
					togglePlay: this.togglePlay
				}
			}
		})

	}

	// App 內部用的 state，不會受外界污染
	state = {
		//
	}

	togglePlay = () => {
		console.log( 'App.togglePlay run > state: ', this.props  )
		this.props.updateState({ 'togglePlay': 'run run'})
	}

	// 理論上可按功能區塊切成多個 store，然後用 nested Provider 包起來再分別餵入即可
	render() {

		return (
			<div>
				<SimpleLabel />
				<WrappedLabel />
				<AdoptedLabel />
				<HOCLabel />
			</div>
		)
	}
}

const WrappedApp = props => (
	<HisStore.Consumer>
		{hisValue => {
			return (
				<HerStore.Consumer>
					{herValue => {

						const merged = merge(hisValue, herValue)
						// console.log( '看合併後是否少東西:', merged )

						return (
							<App {...merged} />
						)
					}}
				</HerStore.Consumer>
			)
		}}
	</HisStore.Consumer>
)

export default WrappedApp
