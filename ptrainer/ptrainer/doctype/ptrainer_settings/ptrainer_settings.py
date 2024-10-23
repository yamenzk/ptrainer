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
            # Get the absolute path to the file in your app's public folder
            file_path = frappe.get_app_path('ptrainer', 'public', 'records', 'exercises.csv')
            
            # Check if file exists
            if not os.path.exists(file_path):
                frappe.throw(_("File not found: {0}").format(file_path))

            # Read the file content
            with open(file_path, 'r') as f:
                csv_content = f.read()
            
            # Check if csv_content is empty
            if not csv_content:
                frappe.throw(_("The file is empty or could not be read."))

            # Parse the CSV content
            csv_reader = csv.DictReader(csv_content.splitlines())
            
            exercise_count = 0
            for row in csv_reader:
                # Skip rows without an 'Exercise' field
                if not row['Exercise']:
                    continue

                # Check if the exercise already exists based on the 'Exercise' field
                existing_exercise = frappe.db.get_value("Exercise", {"exercise": row['Exercise']})
                
                if existing_exercise:
                    # Update the existing exercise if it already exists
                    exercise_doc = frappe.get_doc("Exercise", existing_exercise)
                else:
                    # Create a new exercise document
                    exercise_doc = frappe.new_doc("Exercise")

                # Set or update the exercise fields
                exercise_doc.exercise = row['Exercise']
                exercise_doc.category = row['Category']
                exercise_doc.equipment = row['Equipment']
                exercise_doc.starting = row['Starting']
                exercise_doc.ending = row['Ending']
                exercise_doc.instructions = row['Instructions']
                exercise_doc.force = row['Force']
                exercise_doc.level = row['Level']
                exercise_doc.mechanic = row['Mechanic']
                exercise_doc.thumbnail = row['Thumbnail']
                exercise_doc.video = row['Video']
                exercise_doc.primary_muscle = row['PrimaryMuscle']

                # Clear existing secondary muscles to avoid duplicates
                exercise_doc.secondary_muscles = []
                
                # Add secondary muscles if present
                if row['Muscle (Secondary Muscles)']:
                    exercise_doc.append('secondary_muscles', {
                        'muscle': row['Muscle (Secondary Muscles)'].strip()
                    })

                # Insert or update the exercise in the database
                exercise_doc.save()
                frappe.db.commit()
                exercise_count += 1

            frappe.msgprint(_(f"Successfully imported/updated {exercise_count} exercises"))
            self.fetched = 1
            self.save()
        
        except Exception as e:
            frappe.log_error(str(e), "Exercise Import Error")
            frappe.throw(_("Error importing exercises: {0}").format(str(e)))
