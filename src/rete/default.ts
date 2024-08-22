import {
	ClassicPreset,
	GetSchemes,
	NodeEditor,
} from 'rete'

import {
	Area2D,
	AreaPlugin,
} from 'rete-area-plugin'

import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin'

import {
  ReactPlugin,
  ReactArea2D,
  Presets as ReactPresets,
} from 'rete-react-plugin'

import { createRoot } from 'react-dom/client'
import { RenderTransformNode, ScopedRange, ScopedRangeControl, TransformNode } from '../nodes/transform'

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<
	  ClassicPreset.Node,
		ClassicPreset.Node
  >
>

// class Connection<A extends Node, B extends Node> extends Classic.Connection<
//   A,
//   B
// > {}

// class NumberNode extends Classic.Node {
//   constructor(initial: number, change?: (value: number) => void) {
//     super('Number')

//     this.addOutput('value', new Classic.Output(socket, 'Number'))
//     this.addControl(
//       'value',
//       new Classic.InputControl('number', { initial, change })
//     )
//   }
// }

// class AddNode extends Classic.Node {
//   constructor() {
//     super('Add')

//     this.addInput('a', new Classic.Input(socket, 'A'))
//     this.addInput('b', new Classic.Input(socket, 'B'))
//     this.addOutput('value', new Classic.Output(socket, 'Number'))
//     this.addControl(
//       'result',
//       new Classic.InputControl('number', { initial: 0, readonly: true })
//     )
//   }
// }

type AreaExtra = Area2D<Schemes> | ReactArea2D<Schemes>

const socket = new ClassicPreset.Socket('socket')

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot })

  editor.use(area)
  area.use(reactRender)
  area.use(connection)

  connection.addPreset(ConnectionPresets.classic.setup())
  reactRender.addPreset(ReactPresets.classic.setup({
    customize: {
	    control(data) {
	      if (data.payload instanceof ScopedRangeControl) {
	        return ScopedRange;
	      }

	      return null;
	    },
      node(context) {
        if (context.payload.label === 'test') {
          return RenderTransformNode;
        }
        else if (context.payload.label === 'Transform') {
          return RenderTransformNode;
        }

        return ReactPresets.classic.Node;
      },
    },
  }))

	const test1 = new TransformNode<Schemes, AreaExtra>(area)
  await editor.addNode(test1)

  const test2 = new ClassicPreset.Node('test')

	test2.addOutput('a', new ClassicPreset.Output(socket, 'foo'))
	test2.addInput('a', new ClassicPreset.Input(socket, 'bar'))

  await editor.addNode(test2)

  await area.nodeViews.get(test1.id)?.translate(100, 100)
  await area.nodeViews.get(test2.id)?.translate(400, 100)

  return {
    destroy: () => area.destroy(),
  }
}
