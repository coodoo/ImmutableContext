import { createImmutableContext } from './ImmutableContext'

// 所有 user method 都寫在裏面
// 讓 user function 有機會預做處理，返還最終結果值就好
const actions = {

	herMethod: val => `herMethod-${val}`,

	sheMethod: val => {
		return val.value + '<<his'
	},
}

const store = {
	herValue: 888,
	actions: actions,
	callbacks: {},
}

const HerContext = createImmutableContext(store)

export default HerContext
