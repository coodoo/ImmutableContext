
// 所有 user method 都寫在裏面
// 讓 user function 有機會預做處理，返還最終結果值就好
const actions = {

	herMethod: val => `herMethod-${val}`,

	hisMethod: val => {
		return val.value + '<<his'
	},
}

export default {
	herValue: 888,
	actions: actions
}
