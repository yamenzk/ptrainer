# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt


import frappe
from frappe import _
import csv
from frappe.model.document import Document
import os


class PtrainerSettings(Document):
    @frappe.whitelist()
    def fetch_premade_exercises(self):
        try:
            file_path = '/assets/ptrainer/records/exercises.csv'
            
            # Check if file exists
            if not os.path.exists(frappe.get_site_path(file_path)):
                frappe.throw(_("File not found: {0}").format(file_path))

            csv_content = frappe.read_file(file_path)
            
            # Check if csv_content is None or empty
            if not csv_content:
                frappe.throw(_("The file is empty or could not be read."))

            csv_reader = csv.DictReader(csv_content.splitlines())
            
            current_exercise = None
            exercise_count = 0
            
            for row in csv_reader:
                if exercise_count >= 5:
                    break
                
                if row['Exercise']:
                    if current_exercise:
                        current_exercise.insert()
                        frappe.db.commit()
                        exercise_count += 1
                    
                    current_exercise = frappe.new_doc("Exercise")
                    current_exercise.exercise = row['Exercise']
                    current_exercise.category = row['Category']
                    current_exercise.equipment = row['Equipment']
                    current_exercise.starting_position = row['Starting']
                    current_exercise.ending_position = row['Ending']
                    current_exercise.instructions = row['Instructions']
                    current_exercise.force = row['Force']
                    current_exercise.level = row['Level']
                    current_exercise.mechanic = row['Mechanic']
                    current_exercise.thumbnail = row['Thumbnail']
                    current_exercise.video = row['Video']
                    current_exercise.primary_muscle = row['Primary Muscle']
                    
                    if row['Muscle (Secondary Muscles)']:
                        current_exercise.append('secondary_muscles', {
                            'muscle': row['Muscle (Secondary Muscles)'].strip()
                        })
                
                elif current_exercise and row['Muscle (Secondary Muscles)']:
                    current_exercise.append('secondary_muscles', {
                        'muscle': row['Muscle (Secondary Muscles)'].strip()
                    })
            
            if current_exercise and exercise_count < 5:
                current_exercise.insert()
                frappe.db.commit()
                exercise_count += 1
                
            frappe.msgprint(_(f"Successfully imported {exercise_count} exercises"))
            
        except Exception as e:
            frappe.log_error(str(e), "Exercise Import Error")
            frappe.throw(_("Error importing exercises: {0}").format(str(e)))