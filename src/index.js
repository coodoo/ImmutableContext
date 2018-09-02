import React from 'react'
import ReactDOM from 'react-dom'
import HisStore from './HisStore'
import App from './App'

import './styles.css'

const Root = props => {
	return (
		<HisStore.Provider>
			<App />
		</HisStore.Provider>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Root />, rootElement)
