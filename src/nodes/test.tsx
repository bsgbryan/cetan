import {
	ClassicScheme,
	Presets,
	RenderEmit,
} from "rete-react-plugin"

import styles from './test.module.css'

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

export default function TestNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
  const controls = Object.entries(props.data.controls)
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
      {controls.map(([key, control]) => control ? (
        <RefControl
          key={key}
          name="control"
          emit={props.emit}
          payload={control}
        />
      ) : null)}
      {/* Inputs */}
      {inputs.map(([key, input]) => input &&
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
      )}
    </div>
  )
}
