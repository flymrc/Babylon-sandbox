import * as React from "react";
import { GlobalState } from "../globalState";

import AV from 'leancloud-storage';
const { Query, User } = AV;

interface Props {
  globalState: GlobalState;
  enabled: boolean;
  icon?: any;
  label: string;
}

const sessionToken = "mxthugco02kqk5dlge1k7wfyu"

export class UploadModelFileButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    AV.init({
      appId: "jDP8JR1RNlbP8mOMzIFke2Wg-gzGzoHsz",
      appKey: "cRatKArJldSYqjlfF7OWnsaC",
      serverURL: "https://jdp8jr1r.lc-cn-n1-shared.com"
    });

    this.login();
  }

  login() {
    User.become(sessionToken).then((user) => {
      console.log("login successful")
    }, (error) => {
      console.error("login failed", error)
    });
  }

  public render() {
    if (!this.props.enabled) {
      return null;
    }

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