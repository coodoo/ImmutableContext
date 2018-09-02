import React from 'react'
import ReactDOM from 'react-dom'
import HerStore from './HerStore'
import HisStore from './HisStore'
import App from './App'

import './styles.css'

const Root = props => {
	return (
		<HisStore.Provider>
			<HerStore.Provider>
				<App />
			</HerStore.Provider>
		</HisStore.Provider>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Root />, rootElement)
