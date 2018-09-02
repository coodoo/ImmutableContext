/* eslint-disable */

import React, { PureComponent } from 'react'
import produce from 'immer'
import merge from 'deepmerge'

/**
 * createImmutableContext(store) 是為了將 store 切分為小塊
 * 分別會提供 { Provider, Consumer } 元件，可層層堆疊
 */
export const createImmutableContext = store => {

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
	class Provider extends PureComponent {

		constructor() {

			super()

			if (store['actions'] === undefined)
				throw new Error('Store.actions{} not found, try adding an empty object.')

			if (Object.isExtensible(store)) {
				// console.log( '強制轉 immutable',  )
				store = produce(store, tmp => ({ ...store }))
			}

			const newStore = produce(store, tmp => {

				// 1. 對 actions{} 內每支指令加料，多傳入 state, updateState 兩樣東西
				// 最終包成 { state{}, updateState, args[] } 三個 props
				for (let key in tmp.actions) {

					const userFn = tmp.actions[key]
					// 重新綁定成呼叫內部真正的 updateState 去 setState 以觸發重繪
					tmp.actions[key] = (...args) => {
						// console.log( 'args =', args )
						return userFn.call(null, {
							state: this.state,
							updateState: this.updateState,
							args: args })
					}
				}

				// 2. 直接將 updateState 注入 store 內方便存取
				tmp.updateState = this.updateState
				console.log( '\n注射:', store )
			})

			this.state = newStore
		}

		// internal updateState 目地是為了確保 immutable 操作
		// 由它代為操作 immer.produce() api
		updateState = next => {
			console.log('1. updateState >next: ', next)
			console.log('2. >old state: ', this.state)

			const newState = produce(this.state, tmp => {
				return { ...tmp, ...next }
				// return merge(tmp, next) // deep merge
			})

			console.log('3. >newState: ', newState)
			return this.setStateAsync(newState)
		}

		// 因為 setState() 是 batched run，因此要確保等到它執行完才跑下一支指令，這樣就能排隊執行多個指令
		// 多謝佳豪提供此手法
		setStateAsync(next) {
		   return new Promise( resolve => this.setState(next, resolve) )
		 }

		render() {
			// console.log('Render > Provider 內部 state: ', this.state, ' >與 props: ', this.props)
			return <cx.Provider value={this.state}>{this.props.children}</cx.Provider>
		}
	}

	return {
		Provider,
		Consumer: cx.Consumer
	}
}
