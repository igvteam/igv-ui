const cssText = `
.igv-alert-dialog-container {
  position: fixed;
  z-index: 2048;
  top: 50%;
  left: 50%;
  margin: -150px 0 0 -150px;
  width: 300px;
  height: 256px;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 400;
  z-index: 2048;
  background-color: white;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center; }
  .igv-alert-dialog-container div:first-child {
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
    background-color: #eee; }
    .igv-alert-dialog-container div:first-child div {
      margin-right: 4px;
      margin-bottom: 2px;
      height: 12px;
      width: 12px;
      color: #7F7F7F; }
    .igv-alert-dialog-container div:first-child div:hover {
      cursor: pointer;
      color: #444; }
  .igv-alert-dialog-container #igv-alert-dialog-body {
    color: #373737;
    width: 100%;
    height: calc(100% - 24px - 64px);
    overflow-y: scroll; }
    .igv-alert-dialog-container #igv-alert-dialog-body #igv-alert-dialog-body-copy {
      cursor: pointer;
      margin: 16px;
      width: auto;
      height: auto;
      overflow-wrap: break-word;
      word-break: break-word;
      background-color: white;
      border: unset; }
  .igv-alert-dialog-container div:last-child {
    width: 100%;
    height: 64px;
    background-color: white;
    display: flex;
    flex-flow: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center; }
    .igv-alert-dialog-container div:last-child div {
      width: 98px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: white;
      font-family: "Open Sans", sans-serif;
      font-size: medium;
      font-weight: 400;
      border-color: #2B81AF;
      border-style: solid;
      border-width: thin;
      border-radius: 4px;
      background-color: #2B81AF; }
    .igv-alert-dialog-container div:last-child div:hover {
      cursor: pointer;
      border-color: #25597f;
      background-color: #25597f; }
`
function writeStyles(styleName, cssText) {
    var styleElement = document.getElementById(styleName);
    if (styleElement)
        document.getElementsByTagName('head')[0].removeChild(
            styleElement);
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.id = styleName;
    styleElement.innerHTML = cssText;
    document.getElementsByTagName('head')[0].appendChild(styleElement);
}

function initStyles() {
    writeStyles("_igv-ui_", cssText);
}

export default initStyles;
