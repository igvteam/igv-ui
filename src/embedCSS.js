
function embedCSS() {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('title', 'igv-ui.css')
    style.innerHTML = `.igv-ui-dropdown {
  cursor: default;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2048;
  border-color: #7F7F7F;
  border-style: solid;
  border-width: 1px;
  font-family: "Open Sans", sans-serif;
  font-size: small;
  font-weight: 400;
  background-color: white;
}
.igv-ui-dropdown > div {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
}
.igv-ui-dropdown > div > div {
  padding: 4px;
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  background-color: white;
}
.igv-ui-dropdown > div > div:last-child {
  border-bottom-color: transparent;
  border-bottom-width: 0;
}
.igv-ui-dropdown > div > div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.04);
}

.igv-ui-popover {
  cursor: default;
  position: absolute;
  z-index: 2048;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  font-family: "Open Sans", sans-serif;
  font-size: small;
  background-color: white;
}
.igv-ui-popover > div:first-child {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-width: 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-popover > div:first-child > div:first-child {
  margin-left: 4px;
}
.igv-ui-popover > div:first-child > div:last-child {
  margin-right: 4px;
  height: 12px;
  width: 12px;
  color: #7F7F7F;
}
.igv-ui-popover > div:first-child > div:last-child:hover {
  cursor: pointer;
  color: #444;
}
.igv-ui-popover > div:last-child {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px;
  max-width: 800px;
  background-color: white;
  border-bottom-width: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.igv-ui-popover > div:last-child > div {
  user-select: all;
  margin-left: 4px;
  margin-right: 4px;
  min-width: 220px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.igv-ui-popover > div:last-child > div > span {
  font-weight: bolder;
}
.igv-ui-popover > div:last-child hr {
  width: 100%;
}

.igv-ui-alert-dialog-container {
  box-sizing: content-box;
  position: absolute;
  z-index: 2048;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 200px;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  outline: none;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 400;
  background-color: white;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.igv-ui-alert-dialog-container > div:first-child {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-alert-dialog-container > div:first-child div:first-child {
  padding-left: 8px;
}
.igv-ui-alert-dialog-container .igv-ui-alert-dialog-body {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  color: #373737;
  width: 100%;
  height: calc(100% - 24px - 64px);
  overflow-y: scroll;
}
.igv-ui-alert-dialog-container .igv-ui-alert-dialog-body .igv-ui-alert-dialog-body-copy {
  margin: 16px;
  width: auto;
  height: auto;
  overflow-wrap: break-word;
  word-break: break-word;
  background-color: white;
  border: unset;
}
.igv-ui-alert-dialog-container > div:last-child {
  width: 100%;
  margin-bottom: 10px;
  background-color: white;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.igv-ui-alert-dialog-container > div:last-child div {
  margin: unset;
  width: 40px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: small;
  font-weight: 400;
  border-color: #2B81AF;
  border-style: solid;
  border-width: thin;
  border-radius: 4px;
  background-color: #2B81AF;
}
.igv-ui-alert-dialog-container > div:last-child div:hover {
  cursor: pointer;
  border-color: #25597f;
  background-color: #25597f;
}

.igv-ui-color-swatch {
  position: relative;
  box-sizing: content-box;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-style: solid;
  border-width: 2px;
  border-color: white;
  border-radius: 4px;
}

.igv-ui-color-swatch:hover {
  border-color: dimgray;
}

.igv-ui-colorpicker-menu-close-button {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 32px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding-right: 8px;
}
.igv-ui-colorpicker-menu-close-button i.fa {
  display: block;
  margin-left: 4px;
  margin-right: 4px;
  color: #5f5f5f;
}
.igv-ui-colorpicker-menu-close-button i.fa:hover,
.igv-ui-colorpicker-menu-close-button i.fa:focus,
.igv-ui-colorpicker-menu-close-button i.fa:active {
  cursor: pointer;
  color: #0f0f0f;
}

.igv-ui-generic-dialog-container {
  box-sizing: content-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: fit-content;
  padding-bottom: 16px;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  z-index: 2048;
  background-color: white;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-header {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div {
  margin-right: 4px;
  margin-bottom: 2px;
  height: 12px;
  width: 12px;
  color: #7F7F7F;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div:hover {
  cursor: pointer;
  color: #444;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-one-liner {
  color: #373737;
  width: 95%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  margin-top: 8px;
  padding-left: 8px;
  overflow-wrap: break-word;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input {
  margin-top: 8px;
  width: 95%;
  height: 24px;
  color: #373737;
  line-height: 24px;
  padding-left: 8px;
  background-color: white;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input > div {
  width: fit-content;
  height: 100%;
  font-size: 16px;
  text-align: right;
  padding-right: 8px;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {
  display: block;
  height: 100%;
  width: 100%;
  padding-left: 4px;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: #373737;
  text-align: left;
  outline: none;
  border-style: solid;
  border-width: thin;
  border-color: #7F7F7F;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {
  width: 50%;
  font-size: 16px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input {
  margin-top: 8px;
  width: calc(100% - 16px);
  height: 24px;
  color: #373737;
  line-height: 24px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {
  display: block;
  height: 100%;
  width: 100%;
  padding-left: 4px;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: #373737;
  text-align: left;
  outline: none;
  border-style: solid;
  border-width: thin;
  border-color: #7F7F7F;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {
  font-size: 16px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input[type=range] {
  width: 70%;
  -webkit-appearance: none;
  background: linear-gradient(90deg, white, black);
  outline: none;
  margin: 0;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input output {
  display: block;
  height: 100%;
  width: 20%;
  font-size: 16px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel {
  width: 100%;
  height: 28px;
  padding-top: 16px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div {
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  width: 75px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-color: transparent;
  border-style: solid;
  border-width: thin;
  border-radius: 2px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:first-child {
  margin-left: 32px;
  margin-right: 0;
  background-color: #5ea4e0;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:last-child {
  margin-left: 0;
  margin-right: 32px;
  background-color: #c4c4c4;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:first-child:hover {
  cursor: pointer;
  background-color: #3b5c7f;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:last-child:hover {
  cursor: pointer;
  background-color: #7f7f7f;
}

.igv-ui-generic-container {
  box-sizing: content-box;
  position: absolute;
  z-index: 2048;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.igv-ui-generic-container > div:first-child {
  cursor: move;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  height: 24px;
  width: 100%;
  background-color: #dddddd;
}
.igv-ui-generic-container > div:first-child > div {
  display: block;
  color: #5f5f5f;
  cursor: pointer;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  margin-bottom: 4px;
}

.igv-ui-dialog {
  z-index: 2048;
  position: fixed;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  background-color: white;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
}
.igv-ui-dialog .igv-ui-dialog-header {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-dialog .igv-ui-dialog-header div {
  margin-right: 4px;
  margin-bottom: 2px;
  height: 12px;
  width: 12px;
  color: #7F7F7F;
}
.igv-ui-dialog .igv-ui-dialog-header div:hover {
  cursor: pointer;
  color: #444;
}
.igv-ui-dialog .igv-ui-dialog-one-liner {
  width: 95%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  margin: 8px;
  overflow-wrap: break-word;
  background-color: white;
  font-weight: bold;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel {
  width: 100%;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div {
  margin: 16px;
  margin-top: 32px;
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  width: 75px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-color: transparent;
  border-style: solid;
  border-width: thin;
  border-radius: 2px;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child {
  background-color: #5ea4e0;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child {
  background-color: #c4c4c4;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child:hover {
  cursor: pointer;
  background-color: #3b5c7f;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child:hover {
  cursor: pointer;
  background-color: #7f7f7f;
}
.igv-ui-dialog .igv-ui-dialog-ok {
  width: 100%;
  height: 36px;
  margin-top: 32px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-dialog .igv-ui-dialog-ok div {
  width: 98px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  border-color: white;
  border-style: solid;
  border-width: thin;
  border-radius: 4px;
  background-color: #2B81AF;
}
.igv-ui-dialog .igv-ui-dialog-ok div:hover {
  cursor: pointer;
  background-color: #25597f;
}

.igv-ui-panel, .igv-ui-panel-row, .igv-ui-panel-column {
  z-index: 2048;
  background-color: white;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.igv-ui-panel-column {
  display: flex;
  flex-direction: column;
}

.igv-ui-panel-row {
  display: flex;
  flex-direction: row;
}

.igv-ui-textbox {
  background-color: white;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.igv-ui-table {
  background-color: white;
}

.igv-ui-table thead {
  position: sticky;
  top: 0;
}

.igv-ui-table th {
  text-align: left;
}

.igv-ui-table td {
  padding-right: 20px;
}

.igv-ui-table tr:hover {
  background-color: lightblue;
}

.igv-ui-center-fixed {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/*# sourceMappingURL=igv-ui.css.map */
`
    document.head.append(style);
}

export default embedCSS
