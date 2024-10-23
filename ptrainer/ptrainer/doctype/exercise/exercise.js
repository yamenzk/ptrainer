// Copyright (c) 2024, YZ and contributors
// For license information, please see license.txt

frappe.listview_settings['Exercise'] = {
    on_page_load: function(listview) {
        listview.page.add_inner_button(__('Fetch Premade Exercises'), function() {
            frappe.call({
                method: "your_app.your_module.fetch_premade_exercises",
                callback: function(r) {
                    if (r.message) {
                        frappe.show_alert({ message: __('Exercises fetched successfully'), indicator: 'green' });
                        listview.refresh();
                    } else {
                        frappe.show_alert({ message: __('Failed to fetch exercises'), indicator: 'red' });
                    }
                }
            });
        });
    }
};
