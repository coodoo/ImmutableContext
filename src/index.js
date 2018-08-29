import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Label from './Label'
import HerContext from './HerContext'
import HisStore from './HisStore'

import './styles.css'

class App extends Component {

	// App 內部用的 state，不會受外界污染
	state = {
		//
	}

	// 理論上可按功能區塊切成多個 store，然後用 nested Provider 包起來再分別餵入即可
	render() {
		return (
			<HisStore.Provider>
				<HerContext.Provider>
					<Label />
				</HerContext.Provider>
			</HisStore.Provider>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
