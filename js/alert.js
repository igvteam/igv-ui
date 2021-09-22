import AlertDialog from './components/alertDialog.js';

// The global Alert dialog

let alertDialog

const Alert = {

    init(root, config) {
        if (!alertDialog) {
	    let alertConfig = {};
            if(config && config.alert) {
                alertConfig = config.alert
            }
            alertDialog = new AlertDialog(root, alertConfig);
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
