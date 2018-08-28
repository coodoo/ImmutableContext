// import produce from 'immer'

/**
 * 這支是 user 控管的 store 檔案
 * 可寫多支 actions
 */

// 所有 user method 都寫在裏面
// 讓 user function 有機會預做處理，返還最終結果值就好
const actions = {

	myMethod: val => {
		console.log('User action run: ', val)
		val.value += '<<my'
		return val
	},

	hisMethod: val => {
		return val.value + '<<his'
	},
}

// store acts just like redux store, for storing global state
// it was made immutable via immer
// and can be accessed by deeply nested child components with help from new context api
// store 在此時還不是 immutable，稍後在 MyContext 內才會封印起來
const store = {
	value: '0.3',
	actions: actions
}

export default store
