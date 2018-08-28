import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from './MyContext2'
import store from './MyStore'
import Label3 from './Label3'
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
				<Label3 />
			</Provider>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
