import React from 'react'
import HisStore from './HisStore'
import HerStore from './HerStore'
import { adopt } from 'react-adopt'

// 這是單純的 presentation component
const Label = props => {
	console.log('label 內拿到 props: ', props)
	const {
		value,
		actions: { myMethod },
	} = props

	const onClick = () => {
		myMethod({
			value: Math.random()
				.toString()
				.substr(0, 5),
		})
	}

	return <button onClick={onClick}>Label2: {value}</button>
}

/* 用 react-adopt 先整合兩份 Consumer render props
-------------------------------------------------- */

// 用 adopt 先包過兩份 Consumer renderProps 語法看起來簡潔許多，不然就會像下面 Wrapped 的例子很醜
const Composed = adopt({
	herValue: <HerStore.Consumer />,
	hisValue: <HisStore.Consumer />,
})

export const AdoptedLabel = props => (
	<Composed>
		{({ herValue, hisValue }) => {
			// console.log('真的有拿到兩份資料:', hisValue, herValue)
			const payload = {
				...hisValue,
				...herValue,
				actions: { ...hisValue.actions, ...herValue.actions },
			}
			return <Label {...payload} />
		}}
	</Composed>
)

/* 用 Wrapped 包過一層方便取得多個 Consumer 資料
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
					const payload = {
						...hisValue,
						...herValue,
						actions: { ...hisValue.actions, ...herValue.actions },
					}
					return props.children(payload)
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

						// 多層堆疊時這裏要注意 hisValue 與 herValue 的 actions{} 會覆寫對方，因此要特別組合一次
						// 這是為何文件上會建議用一個 hoc 來一次整合兩份 Provider 的資料
						return (
							<Label
								{...hisValue}
								{...herValue}
								actions={{ ...hisValue.actions, ...herValue.actions }}
							/>
						)
					}}
				</HerStore.Consumer>
			)
		}}
	</HisStore.Consumer>
)
