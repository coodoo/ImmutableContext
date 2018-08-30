import React, { PureComponent } from 'react'
import produce from 'immer'

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

			// console.log('ctor 拿的到 props=', Object.isExtensible(store.actions), store )

			const newStore = produce(store, tmp => {
				for (let key in tmp.actions) {
					const userFn = tmp.actions[key]
					// 重新綁定成呼叫內部真正的 updateStore 去 setState 以觸發重繪
					tmp.actions[key] = (...args) => {
						// console.log( 'args =', args )
						// 後來想到這裏還可 return this.updateStore() 就能支援 asyncSetState 了
						// +todo: 目前只先 return Promise，還沒寫 asyncSetState 的部份
						return this.updateStore(userFn.call(null, this.state, ...args))
					}
				}
			})

			this.state = newStore
		}

		// internal updateStore 目地是為了確保 immutable 操作
		// 由它代為操作 immer.produce() api
		updateStore = next => {
			// console.log('真的 updateStore 跑了: ', next, ' >state: ', this.state)

			return Promise.resolve(next).then(val => {
				console.log( '進到真正處理段落', val )

				const newState = produce(this.state, tmp => {
					return { ...tmp, ...val }
				})

				// console.log('updateStore 後 newState=', 	newState)

				// this.setState(newState)
				return this.setStateAsync(newState)

				// console.log( '\t updateStore 完畢',  )
			})
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
