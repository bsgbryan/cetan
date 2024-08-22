import {
	ClassicScheme,
	Presets,
	RenderEmit,
} from "rete-react-plugin"

import styles from './transform.module.css'
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

	return <div className={`${styles.scopedRange} ${cls}`}>
		<h4>{label}</h4>
		<div className={styles.inputs}>
			<input type="number"
				value={min}
				onChange={ e => change('min', e.currentTarget.valueAsNumber)}
				className={styles.scopedMin}
			/>
			<input type="number"
				value={current}
				onChange={ e => change('current', e.currentTarget.valueAsNumber)}
				className={styles.scopedCurrent}
			/>
			<input type="number"
				value={max}
				onChange={ e => change('max', e.currentTarget.valueAsNumber)}
				className={styles.scopedMax}
			/>
			<input type="range"
				min={min}
				max={max}
				value={current}
				step={.00001}
				onChange={ e => change('current', e.currentTarget.valueAsNumber)}
				className={styles.scopedValueRange}
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

		const translationX = new ScopedRangeControl('X', 'translation', -1, 1, 0,
			function (field: string, value: number) {
				// @ts-expect-error Fuck you
				translationX[field] = value
				area.update('control', translationX.id)
			})
		this.addControl('translation-x', translationX)

		const translationY = new ScopedRangeControl('Y', 'translation', -1, 1, 0,
			function (field: string, value: number) {
				// @ts-expect-error Fuck you
				translationY[field] = value
				area.update('control', translationY.id)
			})
		this.addControl('translation-y', translationY)

		const translationZ = new ScopedRangeControl('Z', 'translation', -1, 1, 0,
			function (field: string, value: number) {
				// @ts-expect-error Fuck you
				translationZ[field] = value
				area.update('control', translationZ.id)
			})
		this.addControl('translation-z', translationZ)
	}
}

export function RenderTransformNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  // const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
  // const controls = Object.entries(props.data.controls)
  const { id, label } = props.data

  return (
    <div className={styles.transform}>
      <h2 className={styles.title}>
        {label}
      </h2>
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
						<li>
			        <RefControl
								key="translation-x"
								name="control"
								emit={props.emit}
								payload={props.data.controls['translation-x']!}
							/>
						</li>
						<li>
							<RefControl
								key="translation-y"
								name="control"
								emit={props.emit}
								payload={props.data.controls['translation-y']!}
							/>
						</li>
						<li>
							<RefControl
								key="translation-z"
								name="control"
								emit={props.emit}
								payload={props.data.controls['translation-z']!}
							/>
						</li>
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
