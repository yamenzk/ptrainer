# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import format_date, getdate, add_days, nowdate, get_first_day_of_week, get_last_day_of_week


class Plan(Document):
    def before_insert(self):
        # Fetch membership details
        membership = frappe.get_doc('Membership', self.membership)
        membership_start = getdate(membership.start)

        # Fetch existing plan docs for the same client and membership
        existing_plans = frappe.get_all('Plan', filters={
            'client': self.client,
            'membership': self.membership
        }, fields=['start', 'end'], order_by='end desc')

        # Determine the start date for the new plan
        if existing_plans:
            # Get the plan with the latest 'end' date
            last_plan = existing_plans[0]
            last_end_date = getdate(last_plan['end'])
            # Nearest Monday after the last plan end date
            self.start = get_first_day_of_week(add_days(last_end_date, 1))
        else:
            # Set the start date to the nearest Monday AFTER the membership start
            first_monday = get_first_day_of_week(membership_start)

            # If membership start is not a Monday, move to the next Monday
            if first_monday < membership_start:
                self.start = add_days(first_monday, 7)
            else:
                self.start = first_monday

        # Set the end date to the following Sunday
        self.end = get_last_day_of_week(self.start)

        # Set the status based on the current date
        current_date = getdate(nowdate())
        if self.start <= current_date <= self.end:
            self.status = 'Active'
        elif current_date > self.end:
            self.status = 'Completed'
        else:
            self.status = 'Scheduled'

        # Generate the title field
        client = frappe.get_doc('Client', self.client)
        client_name = client.client_name.split()

        first_name = client_name[0]  # First name initial
        if len(client_name) > 1:
            last_initial = client_name[-1][0].upper()  # Last name initial
        else:
            last_initial = ""

        start_dd_mm = format_date(self.start, "dd/MM")
        end_dd_mm = format_date(self.end, "dd/MM")
        year = format_date(self.start, "YY")

        # Construct the title in the desired format
        self.title = f"{first_name}{last_initial}@{start_dd_mm}-{end_dd_mm}#{year}"
        if 6 >= self.weekly_workouts >= 3:
            self.d7_rest = 1
            if self.weekly_workouts < 6:
                self.d6_rest = 1
            if self.weekly_workouts < 5:
                self.d5_rest = 1
            if self.weekly_workouts < 4:
                self.d4_rest = 1