import { ClassicScheme, RenderEmit, Presets } from "rete-react-plugin"

const { RefSocket, RefControl } = Presets.classic

type Props<S extends ClassicScheme> = {
  data: S["Node"]
  emit: RenderEmit<S>
}
export type NodeComponent<Scheme extends ClassicScheme> = (
  props: Props<Scheme>
) => JSX.Element

export function CustomNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
  const controls = Object.entries(props.data.controls)
  // const selected = props.data.selected || false
  const { id, label } = props.data

  return (
    <div>
      <div className="title" data-testid="title">
        {label}
      </div>
      {/* Outputs */}
      {outputs.map(
        ([key, output]) =>
          output && (
            <div className="output" key={key} data-testid={`output-${key}`}>
              <div className="output-title" data-testid="output-title">
                {output?.label}
              </div>
              <RefSocket
                name="output-socket"
                side="output"
                emit={props.emit}
                socketKey={key}
                nodeId={id}
                payload={output.socket}
                data-testid="output-socket"
              />
            </div>
          )
      )}
      {/* Controls */}
      {controls.map(([key, control]) => {
        return control ? (
          <RefControl
            key={key}
            name="control"
            emit={props.emit}
            payload={control}
            data-testid={`control-${key}`}
          />
        ) : null
      })}
      {/* Inputs */}
      {inputs.map(
        ([key, input]) =>
          input && (
            <div className="input" key={key} data-testid={`input-${key}`}>
              <RefSocket
                name="input-socket"
                emit={props.emit}
                side="input"
                socketKey={key}
                nodeId={id}
                payload={input.socket}
                data-testid="input-socket"
              />
              {input && (!input.control || !input.showControl) && (
                <div className="input-title" data-testid="input-title">
                  {input?.label}
                </div>
              )}
              {input?.control && input?.showControl && (
                <span className="input-control">
                  <RefControl
                    key={key}
                    name="input-control"
                    emit={props.emit}
                    payload={input.control}
                    data-testid="input-control"
                  />
                </span>
              )}
            </div>
          )
      )}
    </div>
  )
}
