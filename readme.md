
- 利用 react v16.3 的 new context API 建立 state management 機制

- 希望能取代 redux 煩雜的 boilerplate code

- 重要特色

	- 強迫 immutable data type

		- 好處是

			- 元件內部可透過 shallow comparison 判斷是否需要重繪

				- 因此建議用 PureComponent 或 recompose() 協助 SFC

			- react state 是 immutable 的不怕半路被人變更內容

	- 可像 redux 般寫 actions

		- actions 支援 async 操作，可返還 Promise，因此可串接多支指令

	- 可依資料類型切成多個 sub-store 來管理，也降低不相干畫面重繪的機率

	- 所有 state 變數與 action 可集中於一份 store.js 內管理

		- 最終包成 ImmutableContext 輸出即可

	- 用法簡單

		- 用戶只需寫自已的 store.js 裏面定義三件事

			- store{} 也就是 app state

			- actions{} 用來更新這份 store{} 的指令，支援 async 操作

			- context 最終返還一份 ImmutableContext{} 即可，語法如下

				import { createImmutableContext } from './ImmutableContext'

				export default createImmutableContext(store)

	- 範例

		- 範例中將 local state 切分為 HisStore 與 HerStore 以示範可層層堆疊 Store Provider

		- Label.js 內示範了兩種使用 Store Consumer 的方式

/* Aug 30, 2018 新增
-------------------------------------------------- */

# 新增支援兩個 use case

	- 修改 ImmutableContext 返還 Promise，因此元件內可等待前一支做完再跑下一支，就不怕順序性問題了

		const handleRemove = async () => {
			await handleRemoveMarker() // 等這支跑完，才執行 save()
			await save()
		}

	- 這樣會否將太多 application logic 都搬到 actions{} 內了？

		- 如果視 actions 為 reducer，那原本就是它該做的事

			- redux 文件也說通常就是放在 actionCreator 或 reducer 內，但比較建議後者

			- 我也認同目前 actions{} 的角色更像 reducer，它屬於 model 的一部份，因此負責處理 biz logic 是合理的

				- reducer 從來就不只是單純 oldState -> newState
