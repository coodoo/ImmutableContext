import React, { PureComponent } from 'react'
import produce from 'immer'
const cx = React.createContext()

/**
 * 這整支是封裝好不需用戶操作的
 * 只要啟動時傳入 store 給 Provider 即可
 * 剩下的邏輯都寫在 Store.js 內，這是最理想的狀態
 *
 * <Provider store={store}>
 * 	<App />
 * </Provider>
 */
export class Provider extends PureComponent {

	constructor(args) {

		super()

		let { store } = args

		if (store['actions'] === undefined)
			throw new Error('Store.actions{} not found, try adding an empty object.')

		if (Object.isExtensible(store)) {
			// console.log( '強制轉 immutable',  )
			store = produce(store, tmp => ({ ...store }))
		}

		// console.log('ctor 拿的到 props=', Object.isExtensible(store.actions), store )

		const newStore = produce(store, tmp => {
			for (let key in tmp.actions) {
				const userFn = tmp.actions[key]
				// 重新綁定成呼叫內部真正的 updateStore 去 setState 以觸發重繪
				tmp.actions[key] = next => this.updateStore(userFn(next))
			}
		})

		this.state = newStore
	}

	// internal updateStore 目地是為了確保 immutable 操作
	// 由它代為操作 immer.produce() api
	updateStore = next => {
		// console.log('真的 updateStore 跑了: ', next, ' >state: ', this.state)

		Promise.resolve(next).then(val => {
			// console.log( '進到真正處理段落', val )

			const newState = produce(this.state, tmp => {
				return { ...tmp, ...val }
			})
			console.log(
				'updateStore 完的 newState=',
				newState,
				Object.isExtensible(newState),
			)
			this.setState(newState)
		})
	}

	render() {
		console.log('Render > Provider 內部 state: ', this.state, ' >與 props: ', this.props)
		return <cx.Provider value={this.state}>{this.props.children}</cx.Provider>
	}
}

export const Consumer = cx.Consumer
