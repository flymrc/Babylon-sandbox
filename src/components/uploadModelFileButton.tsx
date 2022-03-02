import * as React from "react";
import { GlobalState } from "../globalState";

import AV from 'leancloud-storage';
const { User } = AV;

interface Props {
  globalState: GlobalState;
  enabled: boolean;
  icon?: any;
  label: string;
}

// FIXME: hard code token
const SESSION_TOKEN = "mxthugco02kqk5dlge1k7wfyu"

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
    User.become(SESSION_TOKEN).then(() => {
      console.log("login successful")
    }, (error) => {
      console.error("login failed", error)
    });
  }

  uploadFileInput = async () => {
    const fileList: File[] | undefined = this.props.globalState.filesInput.filesToLoad;
    if (fileList) {
      const file = fileList[0];
      const avFile = new AV.File(file.name, file);
      await avFile.save();

      console.log(avFile);
      console.log(avFile.url());
      alert(avFile.url());
    }
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
              onClick={this.uploadFileInput}
            />
          </div>
        }
      </div>
    )
  }
}