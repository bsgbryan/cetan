import { createEditor } from './rete'
import { useRete } from 'rete-react-plugin'

import './App.css'
import './rete.css'

function App() {
  const [ref] = useRete(createEditor)

  return <div ref={ref} className="rete"></div>
}

export default App
