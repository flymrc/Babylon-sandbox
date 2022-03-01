import * as React from "react";
import { GlobalState } from "../globalState";

interface Props {
  globalState: GlobalState;
  icon?: any;
  label: string;
}

export class UploadModelFile extends React.Component<Props> {
  public render() {
    return (
      <div className="dropup">
        {
          this.props.icon &&
          <div className="button">
            <img
              className="icon-n1"
              src={this.props.icon}
              alt={this.props.label}
              title={this.props.label}
            />
          </div>
        }
      </div>
    )
  }
}