// Copyright (c) 2024, YZ and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ptrainer Settings', {
    fetch_premade_exercises: function(frm) {
        frm.call({
            doc: frm.doc,
            method: 'fetch_premade_exercises',
        });
    }
});