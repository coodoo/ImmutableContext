import React from 'react'
import HisStore from './HisStore'
import HerStore from './HerStore'

// 這是單純的 presentation component
const Label = props => {
	console.log('label 內拿到 props: ', props)
	const {
		value,
		actions: { myMethod }
	} = props

	const onClick = () => {
		myMethod({
			value: Math.random()
				.toString()
				.substr(0, 5)
		})
	}

	return <button onClick={onClick}>Label2: {value}</button>
}

//========================================================================
//
// 下面是複雜版

// 示範用 Wrapped 元件預先整合兩份資料再透過 render props 手法餵入 Label 內使用
const Wrapped = props => {
	return (
		<HisStore.Consumer>
			{
				hisValue => {
					// console.log( '看 hisValue:', hisValue )
					return (
						<HerStore.Consumer>
						{ herValue => {
							// console.log( '看內層 herValue:', herValue )

							const payload = { ...hisValue, ...herValue, actions: {...hisValue.actions, ...herValue.actions} }

							return props.children(payload)
						}}
						</HerStore.Consumer>
					)
				}
			}
		</HisStore.Consumer>
	)
}

// 因為是 render props 因此將來可置換 Label 為任何元件，它們皆可收到 HisStore 與 HerStore 的值
export const WrappedLabel = props => (
	<Wrapped>
		{
			pay => <Label {...pay} />
		}
	</Wrapped>
)

//========================================================================
//
// 這是原始版，寫死只能處理 <Label> 一個元件

export const SimpleLabel = props => (
	<HisStore.Consumer>
		{
			hisValue => {
				// console.log( '看 hisValue:', hisValue )
				return (
					<HerStore.Consumer>
					{ herValue => {
						// console.log( '看內層 herValue:', herValue )

						// 多層堆疊時這裏要注意 hisValue 與 herValue 的 actions{} 會覆寫對方，因此要特別組合一次
						// 這是為何文件上會建議用一個 hoc 來一次整合兩份 Provider 的資料
						return <Label {...hisValue} {...herValue} actions={{...hisValue.actions, ...herValue.actions}} />
					}}
					</HerStore.Consumer>
				)
			}
		}
	</HisStore.Consumer>
)
