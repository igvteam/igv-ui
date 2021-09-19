import AlertDialog from './components/alertDialog.js';

// The global Alert dialog

let alertDialog

const Alert = {

    init(root, settings) {
        if (!alertDialog) {
            alertDialog = new AlertDialog(root, settings);
        }
    },

    presentAlert (alert, callback) {
        if(!alertDialog) {
            this.init(document.body);
        }
        alertDialog.present(alert, callback);
    },
}

export default Alert;
