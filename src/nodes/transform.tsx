import { BaseSchemes, ClassicPreset } from "rete"
import { AreaPlugin } from "rete-area-plugin"
import {
	ClassicScheme,
	Presets,
	RenderEmit,
} from "rete-react-plugin"

import styles from './transform.module.css'

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
		public change: (field: ScopedRangeField, value: number) => void,
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

type ScopedRangeField = 'min' | 'max' | 'current';

export class TransformNode<S extends BaseSchemes, A> extends ClassicPreset.Node {
	constructor(area: AreaPlugin<S, A>) {
		super('Transform')

		this.addOutput('foo', new ClassicPreset.Output(socket, 'foo'))

		const translationX = new ScopedRangeControl('X', 'translation', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				translationX[field] = value
				area.update('control', translationX.id)
			})
		this.addControl('translation-x', translationX)

		const translationY = new ScopedRangeControl('Y', 'translation', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				translationY[field] = value
				area.update('control', translationY.id)
			})
		this.addControl('translation-y', translationY)

		const translationZ = new ScopedRangeControl('Z', 'translation', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				translationZ[field] = value
				area.update('control', translationZ.id)
			})
		this.addControl('translation-z', translationZ)
		
		const scaleX = new ScopedRangeControl('X', 'scale', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				scaleX[field] = value
				area.update('control', scaleX.id)
			})
		this.addControl('scale-x', scaleX)

		const scaleY = new ScopedRangeControl('Y', 'scale', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				scaleY[field] = value
				area.update('control', scaleY.id)
			})
		this.addControl('scale-y', scaleY)

		const scaleZ = new ScopedRangeControl('Z', 'scale', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				scaleZ[field] = value
				area.update('control', scaleZ.id)
			})
		this.addControl('scale-z', scaleZ)
		
		const rotationX = new ScopedRangeControl('X', 'rotation', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				rotationX[field] = value
				area.update('control', rotationX.id)
			})
		this.addControl('rotation-x', rotationX)

		const rotationY = new ScopedRangeControl('Y', 'rotation', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				rotationY[field] = value
				area.update('control', rotationY.id)
			})
		this.addControl('rotation-y', rotationY)

		const rotationZ = new ScopedRangeControl('Z', 'rotation', -1, 1, 0,
			function (field: ScopedRangeField, value: number) {
				rotationZ[field] = value
				area.update('control', rotationZ.id)
			})
		this.addControl('rotation-z', rotationZ)
	}
}

export function RenderTransformNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  // const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
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
					<ol>
						<li>
			        <RefControl
								key="scale-x"
								name="control"
								emit={props.emit}
								payload={props.data.controls['scale-x']!}
							/>
						</li>
						<li>
							<RefControl
								key="scale-y"
								name="control"
								emit={props.emit}
								payload={props.data.controls['scale-y']!}
							/>
						</li>
						<li>
							<RefControl
								key="scale-z"
								name="control"
								emit={props.emit}
								payload={props.data.controls['scale-z']!}
							/>
						</li>
					</ol>
        </li>
				<li>
	      	<h3>Anchor</h3>
        </li>
				<li>
	      	<h3>Rotation</h3>
					<ol>
						<li>
			        <RefControl
								key="rotation-x"
								name="control"
								emit={props.emit}
								payload={props.data.controls['rotation-x']!}
							/>
						</li>
						<li>
							<RefControl
								key="rotation-y"
								name="control"
								emit={props.emit}
								payload={props.data.controls['rotation-y']!}
							/>
						</li>
						<li>
							<RefControl
								key="rotation-z"
								name="control"
								emit={props.emit}
								payload={props.data.controls['rotation-z']!}
							/>
						</li>
					</ol>
        </li>
       </ul>
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
