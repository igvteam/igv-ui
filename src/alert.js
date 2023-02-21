import AlertDialog from './components/alertDialog.js';

// The global Alert dialog

let alertDialog

const Alert = {

    init(root, config={}) {
	    alertDialog = new AlertDialog(root, config);
    },

    presentAlert (alert, callback) {
        if(!alertDialog) {
            this.init(document.body);
        }
        alertDialog.present(alert, callback);
    },
}

export default Alert;
