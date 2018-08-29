import React from 'react'
import HisStore from './HisStore'
import HerStore from './HerStore'

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


export default props => (
	<HisStore.Consumer>
		{
			hisValue => {
				console.log( '看 hisValue:', hisValue )
				return (
					<HerStore.Consumer>
					{ herValue => {
						console.log( '看內層 herValue:', herValue )

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

// export default props => 'fooo'
