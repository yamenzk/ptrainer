// Copyright (c) 2024, YZ and contributors
// For license information, please see license.txt

frappe.ui.form.on('Plan', {
    refresh: function(frm) {
        if (frm.doc.weekly_workouts && frm.doc.daily_meals && frm.doc.target_carbs && frm.doc.target_energy && frm.doc.target_proteins && frm.doc.target_fats) {
            const message = `
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #dcdcdc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1; text-align: center;">
                        <strong style="color: #444; font-size: 16px;">Preferences</strong>
                    </div>    
                    <div style="flex: 1; text-align: center;">
                            <p style="margin: 0; font-weight: 500; color: #666;">Weekly Workouts</p>
                            <span style="font-size: 12px; color: #333;">${frm.doc.weekly_workouts}</span>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <p style="margin: 0; font-weight: 500; color: #666;">Daily Meals</p>
                            <span style="font-size: 12px; color: #333;">${frm.doc.daily_meals}</span>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <p style="margin: 0; font-weight: 500; color: #666;">Goal</p>
                            <span style="font-size: 12px; color: #333;">${frm.doc.goal}</span>
                        </div>
                    </div>
                    <hr style="border: 1px solid #dcdcdc; margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1; text-align: center;">
                            <strong style="color: #444; font-size: 16px;">Targets</strong>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <strong style="color: #28a745; font-size: 16px;">${frm.doc.target_proteins} g</strong>
                            <p style="margin: 0; font-size: 12px; color: #666;">Proteins</p>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <strong style="color: #dc3545; font-size: 16px;">${frm.doc.target_fats} g</strong>
                            <p style="margin: 0; font-size: 12px; color: #666;">Fats</p>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <strong style="color: #ffc107; font-size: 16px;">${frm.doc.target_carbs} g</strong>
                            <p style="margin: 0; font-size: 12px; color: #666;">Carbs</p>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <strong style="color: #17a2b8; font-size: 16px;">${frm.doc.target_energy} kcal</strong>
                            <p style="margin: 0; font-size: 12px; color: #666;">Energy</p>
                        </div>
                    </div>
                </div>`;
            frm.set_intro(message, 'orange');
        }
    },
    client: function(frm) {
        if (frm.doc.client) {
            // Fetch memberships related to the client
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Membership',
                    filters: {
                        client: frm.doc.client,
                        active: 1
                    },
                    fields: ['name', 'package']
                },
                callback: function(response) {
                    let memberships = response.message;
                    if (memberships.length === 1) {
                        // If only one membership, populate it automatically
                        frm.set_value('membership', memberships[0].name);
                        frm.save();  // Insert the doc after membership is filled
                    } else if (memberships.length > 1) {
                        // If multiple memberships, show a dialog for selection
                        let options = memberships.map(m => ({ label: m.package, value: m.name }));
                        let d = new frappe.ui.Dialog({
                            title: 'Select Membership',
                            fields: [
                                {
                                    fieldname: 'selected_membership',
                                    label: 'Membership',
                                    fieldtype: 'Select',
                                    options: options
                                }
                            ],
                            primary_action: function(data) {
                                frm.set_value('membership', data.selected_membership);
                                frm.save();  // Insert the doc after membership is filled
                                d.hide();
                            }
                        });
                        d.show();
                    }
                }
            });
        }
    },
    onload: function(frm) {
        // Array of field names that need the food filter
        const fieldNames = ['d1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f'];
        
        // Apply the filter to each field
        fieldNames.forEach(fieldName => {
            frm.fields_dict[fieldName].grid.get_field('food').get_query = function(doc, cdt, cdn) {
                return {
                    filters: [
                        ['name', 'not in', get_blocked_foods(frm)],
                        ['enabled', '=', 1]
                    ]
                };
            };
        });
    },
    before_save: function(frm) {
        // Collect all food data at once
        const allFoodData = {};
        const table_ids = ['d1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f'];
        
        table_ids.forEach(table_id => {
            const food_data = frm.doc[table_id]
                .filter(row => row.food && row.amount)
                .map(row => ({
                    food_docname: row.food,
                    amount_in_grams: parseFloat(row.amount)
                }));
                
            if (food_data.length > 0) {
                allFoodData[table_id] = food_data;
            }
        });
    
        // Only make the server call if we have data
        if (Object.keys(allFoodData).length > 0) {
            frappe.call({
                freeze: true,
                freeze_message: __('Calculating...'),
                method: 'ptrainer.ptrainer.doctype.plan.plan.calculate_all_nutritional_totals',  // Updated path
                args: { all_food_data: allFoodData },
                callback: function(r) {
                    if (r.message) {
                        Object.entries(r.message).forEach(([table_id, totals]) => {
                            const summary = `Protein: ${Math.round(totals.protein)}g + Carbs: ${Math.round(totals.carbs)}g + Fat: ${Math.round(totals.fat)}g = ${Math.round(totals.energy)} kcal`;
                            const stat_div_id = `${table_id}_macro`;
                            frm.set_value(stat_div_id, summary);
                        });
                    }
                }
            });
        }
    },
    d1_template: function(frm) {
        populate_exercises(frm, 'd1_template', 'd1_e');
    },
    d2_template: function(frm) {
        populate_exercises(frm, 'd2_template', 'd2_e');
    }, 
    d3_template: function(frm) {
        populate_exercises(frm, 'd3_template', 'd3_e');
    },
    d4_template: function(frm) {
        populate_exercises(frm, 'd4_template', 'd4_e');
    },
    d5_template: function(frm) {
        populate_exercises(frm, 'd5_template', 'd5_e');
    },
    d6_template: function(frm) {
        populate_exercises(frm, 'd6_template', 'd6_e');
    },
    d7_template: function(frm) {
        populate_exercises(frm, 'd7_template', 'd7_e');
    },
});

function get_blocked_foods(frm) {
    let blocked_foods = frm.doc.blocked_foods
    return blocked_foods ? blocked_foods.split(',').map(id => id.trim()) : [];
}

function populate_exercises(frm, template_field, exercise_table) {
    if (frm.doc[template_field]) {
        // Clear existing entries in exercise table
        frm.doc[exercise_table] = [];
        
        // Fetch exercises from the template
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Exercise Template',
                name: frm.doc[template_field]
            },
            callback: function(response) {
                if (response.message && response.message.exercises) {
                    // Loop through exercises in template
                    response.message.exercises.forEach(function(exercise) {
                        // Add each exercise to exercise table
                        let row = frm.add_child(exercise_table, {
                            exercise: exercise.exercise,
                            sets: exercise.sets,
                            reps: exercise.reps,
                            rest: exercise.rest,
                            super: exercise.super
                        });
                    });
                    
                    // Refresh the child table
                    frm.refresh_field(exercise_table);
                }
            }
        });
    }
}