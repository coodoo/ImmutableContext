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
						// +todo: 實際上這裏還可 return this.updateStore() 就能支援 asyncSetState 了
						// ← 但因為那裏用 Promise.resolve() 已經是非同步，大概不行
						this.updateStore(userFn.call(null, this.state, ...args))
					}
				}
			})

			this.state = newStore
		}

		// internal updateStore 目地是為了確保 immutable 操作
		// 由它代為操作 immer.produce() api
		updateStore = next => {
			// console.log('真的 updateStore 跑了: ', next, ' >state: ', this.state)

			Promise.resolve(next).then(val => {
				console.log( '進到真正處理段落', val )

				const newState = produce(this.state, tmp => {
					return { ...tmp, ...val }
				})
				console.log(
					'updateStore 後 newState=',
					newState,
					Object.isExtensible(newState),
				)
				this.setState(newState)
			})
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
