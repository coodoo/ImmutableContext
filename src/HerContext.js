import { createImmutableContext } from './ImmutableContext'
import herStore from './HerStore'

const HerContext = createImmutableContext(herStore)

export default HerContext

