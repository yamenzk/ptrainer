import frappe

@frappe.whitelist()
def calculate_nutritional_facts(food_docname, amount_in_grams):
    # Fetch the food document
    food_doc = frappe.get_doc('Food', food_docname)
    
    # Retrieve the nutritional facts table
    nutritional_facts = food_doc.get('nutritional_facts')
    
    # Initialize a dictionary to store the calculated facts
    calculated_facts = {}
    
    # Iterate through each row in the nutritional facts table
    for fact in nutritional_facts:
        # Calculate the value for the given amount_in_grams
        calculated_value = (fact.value / 100) * float(amount_in_grams)
        
        # Store the result in the calculated_facts dictionary
        calculated_facts[fact.nutrient] = {
            'value': calculated_value,
            'unit': fact.unit
        }
    
    return calculated_facts

@frappe.whitelist()
def get_membership(membership):
    # Fetch the membership document
    membership_doc = frappe.get_doc("Membership", membership)
    
    # Convert to a dictionary
    membership_data = membership_doc.as_dict()
    
    # Here you can include additional logic to fetch related data if needed
    # For example, fetching client details or associated plans
    
    # You can also include any additional computations or transformations on membership_data

    return membership_data