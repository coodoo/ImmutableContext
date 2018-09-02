import { createImmutableContext } from './ImmutableContext'

/**
 * 這支是 user 控管的 store 檔案
 * 可寫多支 actions
 */

// 所有 user method 都寫在裏面
// 讓 user function 有機會預做處理，返還最終結果值就好
const actions = {

	myMethod: async ({state, updateState, args}) => {
		console.log( 'herMethod 開始跑，要 1s 後才結束',  )
		const [obj] = args
		const result = await wait(1000)
		obj.value += ' my ' + result
		console.log( 'herMethod 要返還',  )
		return updateState(obj)
	},

	// 第一參數固定傳入 this.state 供讀取目前新值，但為 immutable 因此無法修改，安啦
	hisMethod: ({state, updateState, args}) => {
		console.log( 'hisMethod 開始跑',  )
		let [ obj, amount, orders ] = args

		// 示範可讀取最新 state 內容
		obj.value += ' his ' + state.value
		amount += 1
		orders.push(88)

		// 示範可操作其它 actions{} 指令
		// actions.save(obj)

		// 這裏的 return 是 optional 的，因為 updateState 內部是用 asyncSetState 會返還 Promise
		// 如果將此 Promise 返還出去，外界即可用 await 排隊依序執行多支指令
		return updateState({value: obj.value, amount, orders})
	},

	save: ({state, updateState, args}) => {
		console.log( 'save: ', args )
	}
}

const wait = time => {
	return new Promise(resolve => setTimeout( () => {
		resolve(time)
	}, time))
}

// store acts just like redux store, for storing global state
// it was made immutable via immer
// and can be accessed by deeply nested child components with help from new context api
// store 在此時還不是 immutable，稍後在 MyContext 內才會封印起來
const store = {
	value: '0.3',
	foo: 'bar',

	actions: actions, // 中立第三方指令

	callbacks: {}, 		// 元件偷藏進來的 callbacks 方便下層元件存取
}

// export default store

export default createImmutableContext(store)
