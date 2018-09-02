import React from 'react'
import HisStore from './HisStore'
import HerStore from './HerStore'
import { adopt } from 'react-adopt'
import merge from 'deepmerge'

// 這是單純的 presentation component
class Label extends React.PureComponent {

	onClick = async () => {

		const {
			actions: { hisMethod, myMethod, },
			callbacks,
		} = this.props

		const togglePlay = callbacks.App ? callbacks.App.togglePlay : null

		// 可先等 async 操作完成再進行下一步
		// await myMethod({value:'herOP'})

		// sync 操作
		hisMethod({value:'hisOP'}, 123, [3,6,9])

		// 示範操作 ui 元件偷藏的指令
		togglePlay()

		console.log( 'onClick 跑完',  )

	}

	render() {

		// console.log('label 內拿到 props: ', this.props)
		const {
			value,
		} = this.props

		return <button onClick={this.onClick}>Label2: {value}</button>
	}
}

/* render props 1 - 用 react-adopt 先整合兩份 Consumer 的內容
----------------------------------------------------------------- */

// 用 adopt 先包過兩份 Consumer renderProps 語法看起來簡潔許多
// 此手法缺點是只能套用於 Label 身上，因為寫死了
const Composed = adopt({
	herValue: <HerStore.Consumer />,
	hisValue: <HisStore.Consumer />,
})

export const AdoptedLabel = props => (
	<Composed>
		{({ herValue, hisValue }) => {
			// console.log('真的有拿到兩份資料:', hisValue, herValue)
			const merged = merge(hisValue, herValue)
			return <Label {...merged} />
		}}
	</Composed>
)

/* render props 2 - 改良為可彈性包入各種子元件
-------------------------------------------------- */

// 亮點是這個 Wrapped 元件內部可包任何 presentation 子元件，就不用每次重複寫
const Wrapped = props => {
	const Composed = adopt({
		herValue: <HerStore.Consumer />,
		hisValue: <HisStore.Consumer />,
	})

	return (
		<Composed>
				{({ herValue, hisValue }) => {
					// console.log('真的有拿到兩份資料:', hisValue, herValue)
					const merged = merge(hisValue, herValue)
					return props.children(merged)
				}}
			</Composed>
	)
}

// 因為是 render props 因此將來可置換 Label 為任何元件，它們皆可收到 HisStore 與 HerStore 的值
export const WrappedLabel = props => (
	<Wrapped>{pay => <Label {...pay} />}</Wrapped>
)

/*
// 這是原始寫法，後來發現下面的兩層 Consumer 可用 react-adopt 改寫的更精簡一點，參考上面範例
const WrappedUgly = props => {
	return (
		<HisStore.Consumer>
			{hisValue => {
				// console.log( '看 hisValue:', hisValue )
				return (
					<HerStore.Consumer>
						{herValue => {
							// console.log( '看內層 herValue:', herValue )
							const payload = {
								...hisValue,
								...herValue,
								actions: { ...hisValue.actions, ...herValue.actions },
							}
							return props.children(payload)
						}}
					</HerStore.Consumer>
				)
			}}
		</HisStore.Consumer>
	)
}

// 因為是 render props 因此將來可置換 Label 為任何元件，它們皆可收到 HisStore 與 HerStore 的值
export const WrappedLabelUgly = props => (
	<Wrapped>{pay => <Label {...pay} />}</Wrapped>
)
*/

/* 這是原始版，寫死只能處理 <Label> 一個元件
-------------------------------------------------- */

export const SimpleLabel = props => (
	<HisStore.Consumer>
		{hisValue => {
			// console.log( '看 hisValue:', hisValue )
			return (
				<HerStore.Consumer>
					{herValue => {
						// console.log( '看內層 herValue:', herValue )
						const merged = merge(hisValue, herValue)
						return <Label {...merged} />
					}}
				</HerStore.Consumer>
			)
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
    			return (
    				<HerStore.Consumer>
    					{herValue => {
    						const merged = merge(hisValue, herValue)
    						return <Label {...merged} />
    					}}
    				</HerStore.Consumer>
    			)
    		}}
    	</HisStore.Consumer>
    )
  }
}

export const HOCLabel = withState(Label)
