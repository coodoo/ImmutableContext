
- 目地

	- 一切設計以實戰上實用為主，不預想將來需要多大彈性(反正通常不會發生)
	- 目地是希望手法能盡量簡便，以快速將東西做出來為主
	- 在可能的範圍內，盡量採用 functional 手法並維持架構整潔，但必要時也會用 quick and dirty trick

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


/* Sep 02, 2018 新增
-------------------------------------------------- */

# 針對實際用例進行大改良

	- 不再支援多個 store，因為我用不到，而且 redux 也不建議這樣做

	- store 內容

		{
			callbacks: {...},

			actions: {...},

			updateState, // fn

			...variables // 各種 state 變數
		}

		- callbacks

			- 由上層元件偷藏進去，通常是放在 constructor 或 componentDidMount 內執行

			- 之後下層元件即可直接透過 global state 取用，從而省去層層下傳之苦

			- 通常會這樣做的指令都是因為它會操作 DOM elem，或要用到元件的 local state or private variable

			- 支援 async 操作

		- actions

			- 這是仿 actionCreator + reducer 合一的中立指令

			- 通常用於操作 side effect，例如存檔或存取遠端 API

			- 寫成 action method 的好處是方便多個元件直接操作現成指令，而不用每次都重寫

			- 支援 async 操作

			- 但我一般不會寫這些指令，較常用 callbacks

		- updateState

			- 由 ImmutableContext 自動注入

			- 因為它是最常使用的指令，因此直接注入方便使用

	- 操作 updateState() 時要記得它是 async 的

		- 因此如果有連續四步驟要執行的話，需用 await 一步步等待操作完成，否則會更新到舊的 state

		- 但如果只有一個步驟(例如最常見的 updateState() )則可射後不理，省略 await

		- 背後原因是因為 updateState 內部是操作 asyncSetState 並返還 Promise，因此它本身不是同步的

			- 實際上本就不能期待 react setState() 是同步的，只是不用寫成醜醜的 setState(newState, ()=>{...} ) 格式

		- 建議一律加上 return updateState()

			- 才能享受 asyncSetState 提供的 await 依序執行好處

	- 新增範例

		- 示範 actions 內放中立第三方指令

			- 而且可多次呼叫 updateState 在操作中更新狀態

		- 示範 ui 偷藏指令到 callbacks{} 內與下層元件取用

	- ImmutableContext 內應改用 _.merge() 做 deep merge 較安全

		const newState = produce(this.state, tmp => {
			return { ...tmp, ...val }
		})


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
