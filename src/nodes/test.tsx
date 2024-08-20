import {
	ClassicScheme,
	Presets,
	RenderEmit,
} from "rete-react-plugin"

import styles from './test.module.css'
import { BaseSchemes, ClassicPreset } from "rete"
import { AreaPlugin } from "rete-area-plugin"

const {
	RefControl,
	RefSocket,
} = Presets.classic

type Props<S extends ClassicScheme> = {
  data: S["Node"]
  emit: RenderEmit<S>
}

export type NodeComponent<Scheme extends ClassicScheme> = (
  props: Props<Scheme>
) => JSX.Element

export class ScopedRangeControl extends ClassicPreset.Control {
	constructor(
		public label: string,
		public context: string,
		public min: number,
		public max: number,
		public current: number,
		public change: (field: string, value: number) => void,
	) { super() }
}

export function ScopedRange(props: {
	data: ScopedRangeControl
}) {
	const {
		context,
		label,
		min,
		max,
		current,
		change,
	} = props.data || {}

	const cls = `${context}-${label}`.toLocaleLowerCase()

	return <div className={cls}>
		<h4>{label}</h4>
		<div className="inputs">
			<input type="number"
				value={min}
				onChange={ e => change('min', e.currentTarget.valueAsNumber)}
				className={`${cls}-min`}
			/>
			<input type="number"
				value={current}
				onChange={ e => change('current', e.currentTarget.valueAsNumber)}
				className={`${cls}-current`}
			/>
			<input type="number"
				value={max}
				onChange={ e => change('max', e.currentTarget.valueAsNumber)}
				className={`${cls}-max`}
			/>
			<input type="range"
				min={min}
				max={max}
				value={current}
				step={.00001}
				onChange={ e => change('current', e.currentTarget.valueAsNumber)}
				className={`${cls}-range`}
				onPointerDown={e => e.stopPropagation()}
			/>
		</div>
	</div>
}

const socket = new ClassicPreset.Socket('socket')

export class TransformNode<S extends BaseSchemes, A> extends ClassicPreset.Node {
	constructor(area: AreaPlugin<S, A>) {
		super('Transform')

		this.addOutput('foo', new ClassicPreset.Output(socket, 'foo'))

		const translationX = new ScopedRangeControl('translation', 'X', -1, 1, 0,
			function (field: string, value: number) {
				// @ts-expect-error Fuck you
				translationX[field] = value
				area.update('control', translationX.id)
			})
		this.addControl('translation-x', translationX)
		// this.addControl('translation-x-max', new ClassicPreset.InputControl('number'))
		// this.addControl('translation-x-val', new ClassicPreset.InputControl('number'))
		// this.addControl('translation-x-range', new ClassicPreset.InputControl('number'))
	}
}

export function RenderTransformNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  // const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
  // const controls = Object.entries(props.data.controls)
  const { id, label } = props.data

  return (
    <div className={styles.test}>
      <div className={styles.title}>
        {label}
      </div>
      {/* Outputs */}
      {outputs.map(([key, output]) => output &&
      	<div className={styles.output} key={key}>
					<div className={styles.outputTitle}>
            {output?.label}
          </div>
          <RefSocket
						name={styles.outputSocket}
            side="output"
            emit={props.emit}
            socketKey={key}
            nodeId={id}
            payload={output.socket}
          />
        </div>
      )}
      {/* Controls */}
     	<ul>
    		<li>
	      	<h3>Translation</h3>
      		<ol>
		        <RefControl
							key="translation-x"
							name="control"
							emit={props.emit}
							payload={props.data.controls['translation-x']!}
						/>
					</ol>
        </li>
				<li>
	      	<h3>Scale</h3>
        </li>
				<li>
	      	<h3>Anchor</h3>
        </li>
				<li>
	      	<h3>Rotation</h3>
        </li>
       </ul>
			{/* controls.map(([key, control]) => {
				console.log(key, control)
				return control ? (
					<RefControl
						key={key}
						name="control"
						emit={props.emit}
						payload={control}
					/>
				) : null
			}) */}
      {/* Inputs */}
      {/* inputs.map(([key, input]) => input &&
				<div className={styles.input} key={key}>
          <RefSocket
						name={styles.inputSocket}
            emit={props.emit}
            side="input"
            socketKey={key}
            nodeId={id}
            payload={input.socket}
          />
          {input && (!input.control || !input.showControl) && (
						<div className={styles.inputTitle}>
              {input?.label}
            </div>
          )}
          {input?.control && input?.showControl && (
						<span className={styles.inputControl}>
              <RefControl
                key={key}
								name={styles.inputControl}
                emit={props.emit}
                payload={input.control}
              />
            </span>
          )}
        </div>
      ) */}
    </div>
  )
}
