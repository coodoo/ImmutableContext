import React from 'react'
import HisStore from './HisStore'
import { adopt } from 'react-adopt'

// 這是單純的 presentation component
class Label extends React.PureComponent {

	onClick = async () => {

		const {
			updateState,
			actions: { hisMethod, myMethod, },
			callbacks,
		} = this.props

		// 取出偷藏在 state 內的上層指令以方便應用
		const togglePlay = callbacks.App ? callbacks.App.togglePlay : null

		// 注意由於 updateState 內部是操作 asyncUpdateState 並返還 Promise
		// 因此如果有四個步驟要依序執行的話，需用 await 一步步執行，否則會更新到舊的 state
		// 但如果只有一個步驟(例如最常見的 updateState() )則可射後不理，省略 await

		// 示範：直接操作 updateState 更新狀態
		await updateState({ status: 'Label::opStart'})

		// 示範：操作上層元件偷藏的指令，可省去層層下傳之苦
		await togglePlay()

		// 示範：操作放於 actions{} 內的中立指令，作用類似 actionCreator + reducer
		await hisMethod({value:'hisOP'}, 123, [3,6,9])

		// 示範：可先等 async 指令完成再進行下一步
		await myMethod({value:'herOP'})

		await updateState({ status: 'Label::opEnd'})

		// console.log( 'onClick 跑完',  )
	}

	render() {

		// console.log('label 內拿到 props: ', this.props)
		const {
			value,
		} = this.props

		return <button onClick={this.onClick}>Label2: {value}</button>
	}
}

/* 這是原始版，寫死只能處理 <Label> 一個元件
-------------------------------------------------- */

export const SimpleLabel = props => (
	<HisStore.Consumer>
		{hisValue => {
			// console.log( '看 hisValue:', hisValue )
			return <Label {...hisValue} />
		}}
	</HisStore.Consumer>
)

/* HOC
-------------------------------------------------- */

// 包成 HOC，這層負責讀取 context 內的 state，這樣就不用一直重覆寫 render props
const withState = Comp => {
  return props => {
    return (
    	<HisStore.Consumer>
    		{hisValue => {
    			return <Label {...hisValue} />
    		}}
    	</HisStore.Consumer>
    )
  }
}

export const HOCLabel = withState(Label)


/* render props 1 - 用 react-adopt 先整合兩份 Consumer 的內容
----------------------------------------------------------------- */

// 用 adopt 先包過兩份 Consumer renderProps 語法看起來簡潔許多
// 此手法缺點是只能套用於 Label 身上，因為寫死了
const Composed = adopt({
	hisValue: <HisStore.Consumer />,
})

export const AdoptedLabel = props => (
	<Composed>
		{({ hisValue }) => {
			return <Label {...hisValue} />
		}}
	</Composed>
)

/* render props 2 - 改良為可彈性包入各種子元件
-------------------------------------------------- */

// 亮點是這個 Wrapped 元件內部可包任何 presentation 子元件，就不用每次重複寫
const Wrapped = props => {
	const Composed = adopt({
		hisValue: <HisStore.Consumer />,
	})

	return (
		<Composed>
				{({ hisValue }) => {
					return props.children(hisValue)
				}}
			</Composed>
	)
}

// 因為是 render props 因此將來可置換 Label 為任何元件，它們皆可收到 HisStore 與 HerStore 的值
export const WrappedLabel = props => (
	<Wrapped>{pay => <Label {...pay} />}</Wrapped>
)

