import AlertDialog from './alertDialog.js';

// The global Alert dialog

let alertDialog

const Alert = {

    init(root) {
        if (!alertDialog) {
            alertDialog = new AlertDialog(root);
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
