
const createGenericSelectModal = id => {

    const generic_select_modal_string =
        `<div id="${ id }" class="modal show" aria-modal="true" style="display: block;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <div class="modal-title"></div>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>×</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <select class="form-control"></select>
                    </div>
                </div>

            </div>
        </div>
    </div>`;

    return generic_select_modal_string;
};
export { createGenericSelectModal }
