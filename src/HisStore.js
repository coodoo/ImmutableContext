import { createImmutableContext } from './ImmutableContext'

/**
 * 這支是 user 控管的 store 檔案
 * 可寫多支 actions
 */

// 所有 user method 都寫在裏面
// 讓 user function 有機會預做處理，返還最終結果值就好
const actions = {

	// 第一參數固定傳入 this.state 供讀取目前新值，但為 immutable 因此無法修改，安啦
	hisMethod: (state, obj) => {
		// 示範可讀取最新 state 內容
		obj.value += ' -- ' + state.value
		return obj
	},
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
	actions: actions
}

// export default store

export default createImmutableContext(store)
