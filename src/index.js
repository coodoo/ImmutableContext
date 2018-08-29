import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from './ImmutableContext'
import store from './MyStore'
import herStore from './HerStore'
import Label from './Label'
import './styles.css'

class App extends Component {

	// App 內部用的 state，不會受外界污染
	state = {
		//
	}

	// 理論上可按功能區塊切成多個 store，然後用 nested Provider 包起來再分別餵入即可
	render() {
		return (
			<Provider store={store}>
				<Provider store={herStore}>
					<Label />
				</Provider>
			</Provider>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
